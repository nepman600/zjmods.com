function setError(num, msg) {
    msg = msg || 'ERROR'
    var err = new Error(msg)
    err.status = num || 404
    return err
}

exports.setError = setError