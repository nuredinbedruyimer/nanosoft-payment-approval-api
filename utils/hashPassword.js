import bcrypt from "bcrypt"

const hashPassword = async(password)=> {
  return  await bcrypt.hash(password, parseInt(process.env.SALT, 10));
}



export default hashPassword