import PropTypes from 'prop-types'

const SharedButton = (props) => {
  const { style, text, onClick, disable } = props
  return (
    <button style={style} onClick={onClick} disabled={disable}>
      {text}
    </button>
  )
}

SharedButton.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string,
  onClick: PropTypes.func,
}

export default SharedButton
