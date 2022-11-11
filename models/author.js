const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { DateTime } =require("luxon")

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("birth_formatted").get(function(){
  return this.date_of_birth ?
  DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED): '';
})

AuthorSchema.virtual('birth_post').get(function(){
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  return this.date_of_birth ? [
    this.date_of_birth.getFullYear(),
    padTo2Digits(this.date_of_birth.getMonth() + 1),
    padTo2Digits(this.date_of_birth.getDate()+1),
  ].join('-'): ''
})


AuthorSchema.virtual("death_formatted").get(function(){
  return this.date_of_death ?
  DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED): '';
})


AuthorSchema.virtual('death_post').get(function(){
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  return this.date_of_death ? [
    this.date_of_death.getFullYear(),
    padTo2Digits(this.date_of_death.getMonth() + 1),
    padTo2Digits(this.date_of_death.getDate()+1),
  ].join('-'): ''
})

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
