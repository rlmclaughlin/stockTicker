import React from 'react'
import axios from 'axios'
import './tickerBoard.css'

import API_KEY from '../../api'


class StockTicker extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      timeStamp: {},
      companies: ['DJI', 'NDAQ', 'SPX', 'AAPL'],
      stocks: [],
    }
  }

  componentDidMount(){
    // Create an array of endpoints (one for each company)
    let promises = this.state.companies.map(company => axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${company}&interval=5min&apikey=${API_KEY}`));

    this.fetchStocks(promises);
  }

  fetchStocks = (promises) => { 
    let stocks = [];
    let timeStamp;

    // Run all network requests simultaneously
    axios
      .all(promises)
      .then(results => {
        // Since we don't necessarily know how many results are coming back, we can't use axios.spread(). Let's loop over the results array
        results.forEach(result => {
          /* If the API is being hit too frequent, the response is as follows:
          *
          * {
          *   "Note": "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. 
          *            Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency."
          * }
          *
          * So let's throw an error if we see the note
          */
          if (result.data.Note) {
            throw new Error();
          }

          let data = result.data['Time Series (5min)'];
          let timeStamps = Object.keys(data);
          let current = data[timeStamps[0]];
          timeStamp = timeStamps[0];

          stocks.push({
            company: result.data['Meta Data']['2. Symbol'],
            values: current
          })

          // You probably don't want to update state within a loop, since it will cause a render for each one. It might be better to build your data within the loop and then update state once after the loop.
        });

        // Update state outside loop
        this.setState({
          stocks,
          timeStamp
        });
      })
      .catch(error => {
        console.error('There was an error with the network requests', error)
      });
  }

  change = (close, start) => {
    let deduct = close - start;
    let divide = deduct / start;
    let solution = divide * 100;
    return solution.toFixed(3);
  }

  render() {
    if(!this.state.stocks.length) {
      return <div>Loading...</div>
    }

    let rows = [];

    const open = '1. open';
    const high = '2. high';
    const low = '3. low';
    const close = '4. close';

    // Instead of defining your data manually line by line, we can simply loop over the data and build the interface programmatically
    this.state.stocks.forEach( stock => {
      console.log(stock)
      rows.push(
        <tr>
          <td>{ stock.company }</td>
          <td>{ stock.values[open] }</td>
          <td>{ stock.values[high] }</td>
          <td>{ stock.values[low] }</td>
          <td>{ stock.values[close] }</td>
          <td>{ `${this.change(stock.values[close], stock.values[open])}%` }</td>
        </tr>
      )
    });

    return (
      <div>  
        <div className='table'>
        <table className="container">
	        <thead>
		        <tr>
			        <th><h1>Company</h1></th>
			        <th><h1>Start</h1></th>
			        <th><h1>High</h1></th>
			        <th><h1>Low</h1></th>
              <th><h1>Close</h1></th>
              <th><h1>Change</h1></th> 
		        </tr>
	        </thead>
	        <tbody>
		        { rows }
	        </tbody>
        </table>
      </div> 
      </div> 
    )
  }
}

export default StockTicker