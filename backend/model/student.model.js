const mongoose = require("mongoose");

const studentschema = mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    age: Number,

    course: {
      type: String,
      enum: ["React", "Node", "Java", "Python"],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    //  RBAC Support 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
  },
  { timestamps: true }
);

const studentmodel = mongoose.model("student", studentschema);

module.exports = {
  studentmodel,
};
