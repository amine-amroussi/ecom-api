

const createTokenUser = (user) => {
    return {name : user.name, email : user.email , role : user.role, userId : user._id}
}

module.exports = createTokenUser