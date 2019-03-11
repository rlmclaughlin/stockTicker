import React from 'react';
import axios from 'axios'
import './tickerBoard.css'


class StockTicker extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      timeStamp: {},
      companies: ['DJI', 'NDAQ', 'SPX'],
      stocks: [],
    }
  }
  componentDidMount(){
    this.state.companies.map( company => {
      return this.fetchStocks(company)
    })
  }

  fetchStocks = (company) => { 
    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${company}&interval=5min&apikey=MRYZL6KHH9MMJYIF`)
      .then( response => {
        const data = response.data['Time Series (5min)']
        const timeStamps = Object.keys(data)
        const current = data[timeStamps[0]]
          console.log('current', current)
        this.setState({
          timeStamp: this.state.stocks.push(current) // The most recent ticker info after 5 mins passed
        })
      })
      .catch(() => {console.log( "we've encountered an error")})
  }

  change = (close, start) => {
    let deduct = close - start
    let divide = deduct / start
    let solution = divide * 100
      return solution.toFixed(3)
  }

  render() { 
    const {timeStamp} = this.state
       if(!Object.keys(timeStamp).length && !this.state.stocks.length) {
        return <div>Loading...</div>
    }

    const dow = this.state.stocks[0] 
    const nasdaq = this.state.stocks[1]
    const open = '1. open'
    const high = '2. high'
    const low = '3. low'
    const close = '4. close'

    console.log(this.state.stocks)
    console.log(this.state.stocks[0]['1. open']) // <---------THIS WORKS AND RETURNS THE VALUE
    console.log(this.state.stocks[1]) //<-----------THIS RETURNS THE ARRAY OBJECT WITH VALUES

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
		        <tr>
		        	<td>Dow</td>
		        	<td>{dow[open]}</td>
		        	<td>{dow[high]}</td>
		        	<td>{dow[low]}</td>
              <td>{dow[close]}</td>
              <td>{this.change(dow[close], dow[open])} %</td>
		        </tr>
		        <tr>
		        	<td>Nasdaq</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>  
		        </tr>
		        <tr>
		        	<td>S&P</td>
		        	<td>4162</td>
		        	<td>5327</td>
		        	<td>00:2</td>
              <td></td>
              <td></td>
		        </tr>
            <tr>
		        	<td>Apple</td>
		        	<td>3654</td>
		        	<td>2961</td>
		        	<td>00:12:10</td>
              <td></td>
              <td></td>
		        </tr>
            <tr>
		        	<td>Amazon</td>
		        	<td>2002</td>
		        	<td>4135</td>
		        	<td>00:46:19</td>
              <td></td>
              <td></td>
		        </tr>
            <tr>
		        	<td>Facebook</td>
		        	<td>4623</td>
		        	<td>3486</td>
		        	<td>00:31:52</td>
              <td></td>
              <td></td>
		        </tr>
	        </tbody>
        </table>
      </div> 
      </div> 
    )
  }
}

export default StockTicker