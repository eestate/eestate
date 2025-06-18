
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name'],
        trim:true,
    },
    email:{
        type:String,
        required:[true,'please add a email'],
        unique:true,
        lowercase:true
    },
    password:{
       type:String,
        minlength:6,
        select:false,
    },
    googleId:{
        type:String,
        default:null,
    },
    phone:{
        type:String,
        trim:true,
    },
    gender:{
        type:String,
        enum:["male","female"],
        default:null,
    },
    profilePic:{
        type:String,
        default:null,
    },
    role:{
        type:String,
        enum:['user','agent','admin'],
        default:'user',
    },
    about: {
  type: String,
  default: null,
},
isBlocked:{
    type:Boolean,
    default:false,
},
isVerified:{
    type:Boolean,

},
isSubscribed:{
    type:Boolean,
    default:false,
},
wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],

subscriptionExpiresAt:{
    type:Date,
    default:null,
},

},  
{ timestamps: true }
)

userSchema.pre('save',async function (next){
    if(!this.isModified("password")) return next()
        if(this.password){
            const salt= await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password,salt)
        }
        next()
})

userSchema.methods.matchPassword = async function(enteredPassword){
 return bcrypt.compare(enteredPassword,this.password)   
}


const User=mongoose.model('User',userSchema)
export default User