import React from 'react'
import './Display.css'

class Display extends React.Component {
	render() {
		return(
			<button className='display'>
			{this.props.value}
			</button>
		);
	}
}

export default Display;
