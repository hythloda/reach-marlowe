
# reach-marlowe

Project Goal: Make a Marlowe-like application for deriving traditional financial instruments using [Reach](https://reach.sh/)


NOTE: This is currently a work in progress and not a functional Reach program!

To run this inside each sub-folder

```shell
./reach react
```

If command is not found
```shell
curl https://docs.reach.sh/reach -o reach ; chmod +x reach
```

If success then go to [http://localhost:3000/](http://localhost:3000/)

## Week 4 : Account connection
Have three accounts and made the logic similar for all.  For some reason the JSON is not showing when it goes into the Buyer account, this is likely the if statement is not right so I have some debugging information and it should go into that area.  Need more troubleshooting. 


## Week 3 : Term based

This week I went back to the basics and was able to apply the concepts of Rock-Paper-scisors tutorial via the command line into the program.  I did not get the account connected but was able to see the logic needed. 

## Week 2 : Try UI

For this week I tried to take on more than I could chew. This seemed like an easy project so I jumped straight to the full blown solution. This did not work and I need to take a step back and review what I am doing and why.  This week really reminds me of the importance of incremental and iterative approaches. 


## Week 1 : Set Goals

###  What is a Marlowe-like application?

From [Cardano](https://developers.cardano.org/docs/smart-contracts/marlowe/#:~:text=Marlowe%20is%20a%20domain%2Dspecific,specifically%20designed%20for%20financial%20contracts.):
- Marlowe is a domain-specific language (DSL) that enables users to create blockchain applications that are specifically designed for financial contracts.

### Example application

The [Marlowe playground](https://marlowe-playground-staging.plutus.aws.iohkdev.io/#/javascript) has a series of examples to use.

### Goals

For week 1 the goal is to get an Escrow account working.  This is with two parties and a mediator that is trusted. The basis is that the funds should always be transferred to the mediator.  Then the funds are transferred to the seller only if the buyer and seller agree on the terms.


## Communication Pattern

This represents the overall communication of buyer and seller.

- Buyer deposits an amount into escrow, states `terms_buyer`.
- Funds sit in escrow. The funds should not be removed without the buyer and the seller's consent or deadline is reached.
- While `time < deadline` and  `complaint == False` escrow sits.
  - Seller asked `complaint == True`
     -  If `complaint == True` escrow to buyer, sale canceled
     -  If `complaint == False` mediator decides outcome
     -  If `complaint == True ` escrow to buyer, sale canceled
     -  If `complaint == False ` escrow to seller, sale continues
- If `time >= deadline` and  `complaint_buyer == False` escrow to seller - sale ends


## Future thoughts to implement

### Add escrow with collateral

### Add terms to match

### Traditional financial instruments

These are generally stocks and bonds.  There are a lot of APIs available that can pull in such traditional information.  Since Reach works very well with Javascript using an API that has a JS backing is important. Also to stick with the mission of this Dapp the API should be open and free.  For this project I think [yahoo finance](https://finance.yahoo.com/) meets those requirements.

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
