import React from 'react';
import PlayerViews from './PlayerViews';

const exports = {...PlayerViews};

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Seller">
        <h2>Seller</h2>
        {content}
      </div>
    );
  }
}

exports.SetAmount = class extends React.Component {
  render() {
    const {parent, defaultAmount, standardUnit} = this.props;
    const amount = (this.state || {}).amount || defaultAmount;
    return (
      <div>
        <input
          type='number'
          placeholder={defaultAmount}
          onChange={(e) => this.setState({amount: e.currentTarget.value})}
        /> {standardUnit}
        <br />
        <button
          onClick={() => parent.setAmount(amount)}
        >Set amount</button>
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const {parent, amount, standardUnit} = this.props;
    return (
      <div>
        Amount (pay to deploy): <strong>{amount}</strong> {standardUnit}
        <br />
        <button
          onClick={() => parent.deploy()}
        >Deploy</button>
      </div>
    );
  }
}

exports.Deploying = class extends React.Component {
  render() {
    return (
      <div>Deploying... please wait.</div>
    );
  }
}

exports.WaitingForBuyer = class extends React.Component {
  async copyToClipboard(button) {
    const {ctcInfoStr} = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = 'Copied!';
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const {ctcInfoStr} = this.props;
    return (
      <div>
        Waiting for Buyer to join...
        <br /> Please give them this contract info:
        <pre className='ContractInfo'>
          {ctcInfoStr}
        </pre>
        <button
          onClick={(e) => this.copyToClipboard(e.currentTarget)}
        >Copy to clipboard</button>
      </div>
    )
  }
}

export default exports;
