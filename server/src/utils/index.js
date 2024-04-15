module.exports = {
  handleError: (err, res, defaultMessage) => {
    if (err.name === 'ValidationError') {
      // Handle Mongoose validation error
      const errors = Object.values(err.errors).map((error, index) =>
        index > 0 ? ' ' + error.message : error.message
      )
      res.status(400).json({ message: String(errors) })
    } else {
      res.status(500).json({ message: defaultMessage })
    }
  },
  validateAndUpdateDocument: async (
    document,
    updateFields,
    excludedFields = []
  ) => {
    Object.keys(updateFields).forEach((field) => {
      if (!excludedFields.includes(field)) {
        document[field] = updateFields[field]
      }
    })
    const validationError = document.validateSync()

    if (validationError) {
      throw validationError
    }

    const updatedDocument = await document.save()

    return updatedDocument
  },

  formatDate: (str) => {
    const [dateValues, timeValues] = str.split(' ')

    const [year, month, day] = dateValues.split('-')
    const [hours, minutes] = timeValues.split(':')

    return new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes, 0))
  },
}
