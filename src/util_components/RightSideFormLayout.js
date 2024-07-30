import React, { Component } from 'react'
import './../styling/RightSideFormLayout.css'

export default class RightSideFormLayout extends Component {
  render() {
    return (
      <>
      <div className="overlay" onClick={this.props.overlayClickAction ? this.props.overlayClickAction : this.props.onClose}/>
      <div className='form-card slide-in-right'>{/* onBlur={this.props.onBlur ? this.props.onBlur : this.props.onClose}> */}
        <button className="close-button" onClick={this.props.onClose}>×</button>
        {this.props.formTitle}
        {this.props.formComponent}
      </div>
      </>
    )
  }
}
