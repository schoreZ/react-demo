import React from 'react'
import Display from '../Display.js'
import ButtonPanel from '../ButtonPanel.js'
import './index.css'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result:'0',
			operator_1:'0',
			operator_2:'0',
			stage:'OP1', // OP1, OP2,
		}
	}
	handleClick(label) {
		let result = this.state.result;
		let op1 = this.state.operator_1;
		let op2 = this.state.operator_2;
		let stage = this.state.stage;
		if (label === 'AC') {
			this.setState({
				result:'0',
				operator_1:'0',
				operator_2:'0',
			});
		} else if (label === '1') {
			if (stage === 'OP1') {
				op1 = (parseInt(op1) * 10 + parseInt(label)).toString();
				this.setState({
					result:op1,
					operator_1:op1,
				});
			} else if (stage === 'OP2') {
				op2 = (parseInt(op2) * 10 + parseInt(label)).toString();
				this.setState({
					result:op2,
					operator_2:op2,
				});
			}
		} else if (label === '+') {
			if (stage === 'OP1') {
				stage = 'OP2';
				this.setState({
					stage:stage,
				});
			}
		} else if (label === '=') {
			if (stage === 'OP2') {
				result = (parseInt(op1) + parseInt(op2)).toString();
				stage = 'OP1';
				this.setState({
					stage:stage,
					result:result,
				});
			}
		}
		//alert(label);
	}
	render() {
		return (
			<div>
			<Display value={this.state.result}/>
			<ButtonPanel onClick={(label) => this.handleClick(label)}>
			</ButtonPanel>
			</div>
		);
	}
}

export default App;
