const expect = require('chai').expect
const validateContact = require('../lib/contact_validator')

describe('Tests for contact validator', () => {
  describe('Input number', () => {
    it('12123456789 should pass', () => {
      let actual = validateContact(12123456789)
      expect(actual).to.be.true
    })
    it('121234567890 should not pass', () => {
      let actual = validateContact(121234567890)
      expect(actual).to.be.false
    })
    it('1212345678 should not pass', () => {
      let actual = validateContact(1212345678)
      expect(actual).to.be.false
    })
    it('23123456789 should not pass', () => {
      let actual = validateContact(23123456789)
      expect(actual).to.be.false
    })
  })
  describe('Input string', () => {
    it('12123456789(string) should pass', () => {
      let actual = validateContact('12123456789')
      expect(actual).to.be.true
    })
    it('121234567890 should not pass', () => {
      let actual = validateContact('121234567890')
      expect(actual).to.be.false
    })
    it('1212345678 should not pass', () => {
      let actual = validateContact('1212345678')
      expect(actual).to.be.false
    })
    it('23123456789 should not pass', () => {
      let actual = validateContact('23123456789')
      expect(actual).to.be.false
    })
    it('1212345678a should not pass', () => {
      let actual = validateContact('1212345678a')
      expect(actual).to.be.false
    })
  })
})
