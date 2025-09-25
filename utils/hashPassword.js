import bcrypt from "bcrypt"

const hashPassword = async(password)=> {
  return  await bcrypt.hash(password, process.env.SALT);
}



export default hashPassword