import React from 'react'
import './Button.css'

class Button extends React.Component {
	render() {
		return (
			<button className='button' onClick={this.props.onClick}>
			{this.props.value}
			</button>
		);
	}
}


export default Button;
