const assert = require('assert')
const sinon = require('sinon')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

describe('Mongoose Discriminators', () => {
   it('Middleware should succesfully be invoked on base and discriminators', async () => {
      const eventSchema = new Schema(
         { message: String },
         { discriminatorKey: 'kind', _id: false }
      )

      const trackSchema = new Schema({
         event: eventSchema
      })

      const clickedSchema = new Schema({
         element: String
      }, { _id: false })

      // This is the discriminator which we will use to test middleware

      const purchasedSchema = new Schema({
         product: String
      }, { _id: false })

      // Setup some spies to test whether the middleware functions execute

      const eventPreValidateSpy = sinon.spy()
      const eventPostValidateSpy = sinon.spy()
      const eventPreSaveSpy = sinon.spy()
      const eventPostSaveSpy = sinon.spy()

      eventSchema.pre('validate', function (next) {
         eventPreValidateSpy()
         next()
      })

      eventSchema.post('validate', function (doc) {
         eventPostValidateSpy()
      })

      eventSchema.pre('save', function (next) {
         eventPreSaveSpy()
         next()
      })

      eventSchema.post('save', function (doc) {
         eventPostSaveSpy()
      })

      const purchasedPreValidateSpy = sinon.spy()
      const purchasedPostValidateSpy = sinon.spy()
      const purchasedPreSaveSpy = sinon.spy()
      const purchasedPostSaveSpy = sinon.spy()

      purchasedSchema.pre('validate', function (next) {
         purchasedPreValidateSpy()
         next()
      })

      purchasedSchema.post('validate', function (doc) {
         purchasedPostValidateSpy()
      })

      purchasedSchema.pre('save', function (next) {
         purchasedPreSaveSpy()
         next()
      })

      purchasedSchema.post('save', function (doc) {
         purchasedPostSaveSpy()
      })

      // Register the discriminators

      trackSchema.path('event').discriminator('Clicked', clickedSchema)
      trackSchema.path('event').discriminator('Purchased', purchasedSchema)

      // Test

      const MyModel = mongoose.model('track', trackSchema)
      const doc = new MyModel({
         event: {
            kind: 'Purchased',
            message: 'Test'
         }
      })

      await doc.save()
      assert.equal(doc.event.message, 'Test')
      assert.equal(doc.event.kind, 'Purchased')
      assert.ok(!doc.event.product)

      // These assertions fail

      assert(eventPreValidateSpy.calledOnce, 'base pre-validate middleware was not called')
      assert(eventPostValidateSpy.calledOnce, 'base post-validate middleware was not called')
      assert(eventPreSaveSpy.calledOnce, 'base pre-save middleware was not called')
      assert(eventPostSaveSpy.calledOnce, 'base post-save middleware was not called')

      assert(purchasedPreValidateSpy.calledOnce, 'discriminator pre-validate middleware was not called')
      assert(purchasedPostValidateSpy.calledOnce, 'discriminator post-validate middleware was not called')
      assert(purchasedPreSaveSpy.calledOnce, 'discriminator pre-save middleware was not called')
      assert(purchasedPostSaveSpy.calledOnce, 'discriminator post-save middleware was not called')
   })
})
