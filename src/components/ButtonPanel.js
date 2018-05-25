import React from 'react'
import Button from './Button'
import './ButtonPanel.css'

class ButtonPanel extends React.Component {
	renderButton(label) {
		return <Button value={label} onClick={()=>this.props.onClick(label)} />
	}
	render() {
		return (
			<div>

			<div>
			{this.renderButton('1')}
			{this.renderButton('2')}
			{this.renderButton('3')}
			</div>

			<div>
			{this.renderButton('+')}
			{this.renderButton('=')}
			{this.renderButton('AC')}
			</div>

			</div>

		);
	}
}

export default ButtonPanel;
