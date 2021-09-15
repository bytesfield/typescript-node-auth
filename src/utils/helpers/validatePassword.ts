/**
       * Validates Password
       *
       * @param {string} password
       *
       * @return boolean
       */
const validatePassword = (password: string): boolean | undefined => {
    const isValidPassword = password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
    )

    if (isValidPassword) {
        return true;
    }
}

export default validatePassword;