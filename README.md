# reach-marlowe

Project Goal: Make a Marlowe-like application for deriving traditional financial instruments

## Defining terms

### Traditional financial instruments

These are generally stocks and bonds.  There are a lot of APIs avilable that can pull in such traditional information.  Since Reach works very well with Javascript using an API that has a JS backing is important. Also to stick with the mission of this Dapp thie API should be open and free.  For this project I think [yahoo finance](https://finance.yahoo.com/) meets those requrements.

Example usage:

```javascript
var yahooFinance = require('yahoo-finance');

yahooFinance.historical({
  symbol: 'AAPL',
  from: '2012-01-01',
  to: '2012-12-31',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
}, function (err, quotes) {
  //...
});

// This replaces the deprecated snapshot() API
yahooFinance.quote({
  symbol: 'AAPL',
  modules: [ 'price', 'summaryDetail' ] // see the docs for the full list
}, function (err, quotes) {
  // ...
});
```

###  What is a Marlowe-like application?

From [Cardano](https://developers.cardano.org/docs/smart-contracts/marlowe/#:~:text=Marlowe%20is%20a%20domain%2Dspecific,specifically%20designed%20for%20financial%20contracts.):
- Marlowe is a domain-specific language (DSL) that enables users to create blockchain applications that are specifically designed for financial contracts.

