import React, {useState, useEffect} from 'react';
import {
  Container, 
  Row,
  Col,
  Form,
  Button,
  Navbar
} from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
import { pulse } from 'react-animations';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Chart from './components/Chart'
import testData from './test.csv';
import testDataLrg from './testLrg.csv';
import symbolList from './SymbolList.csv';

//API_KEY to access the stock data
const API_KEY = 'QH12AZJNBR1MYGM7';

const bounceAnimation = keyframes`${pulse}`;
 
const BouncyDiv = styled.div`
  animation: 1s ${bounceAnimation} infinite;
`;


function App() {
  //The stock date
  const nullData = {
    graphData: [{
      label: 0,
      y: 0
    }],
    data: []
  }
  const [data, setData] = useState(nullData);
  
  //The list of symbols
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  //What will be searched default the first in dropdown list.
  var search = 'A - "Agilent Technologies"';
  var timeStep = 'daily';

  async function getData(searchParam, timeS){
    var symbol = searchParam.split(" ")[0];
    setData(nullData);
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_${timeS}&symbol=${symbol}&apikey=${API_KEY}&datatype=csv&outputsize=full`;
    //var url = testData;
    //var url = testDataLrg;
    try{
      setLoading(true);

      var response = await fetch(url);
      var rawData = await response.text();

      setLoading(false);

      var rows = rawData.split('\n');
      var data = [];
      var fullData = {
        symbol: symbol,
        name: searchParam,
        graphData: [],
        data: []
      };
      for(var i = rows.length-2; i >= 1; i --){
        var splitRow = rows[i].split(',');
        data.push({
          label: splitRow[0],
          y: parseFloat(splitRow[2])
        });
        fullData.data.push(splitRow);
      }
      fullData.graphData = data;
      setData(fullData);
      console.log(fullData);
    }catch(e){
      setData(nullData);
      return <h2>Couldn't get the data, please try again</h2>
      console.log(e);
    }
  }

  async function getSymbols(){
    var response = await fetch(symbolList);
  
    var raw = await response.text();
    var rows = raw.split('\n');
    var list = [];
    for(var i = 0; i < rows.length; i ++){
      list.push(rows[i].split(','))
    }

    setSymbols(list);
  }
  
  var drawChart = () =>{
    if(loading){
      return <BouncyDiv><h3 className="loading">Loading</h3></BouncyDiv>
    }
    else if(data.data.length != 0){
      return <Chart data={data}></Chart>
    }else{
      return <p>Search a company to see their stock value</p>
    }
  }

  useEffect(()=>{
    //getData("IBM - International Business Machines Corporation Common Stock"); 
    getSymbols();
    
  }, []);
  
 
  //
  const titles = {
    mainTitle: "IBM Stock Price",
    axisX: "Date",
    axisY: "Price USD"
  }
  return (
    <div className="App">
      <Navbar bg="light">
        <Navbar.Brand href="#">Stock Checker</Navbar.Brand>
      </Navbar>
      
      <Container fluid>
        <Row className="justify-content-left">
          <Col xs={12} md={6}>
            <Form>
              <Form.Group >
                <Form.Label>Choose Stock</Form.Label>
                <Form.Control as="select" onChange={(e)=>search = e.target.value}>
                    {symbols.map(symbol => (
                      <option key={Math.random()}>{`${symbol[0]} - ${symbol[1]}`}</option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Form.Group >
                <Form.Label>Choose Time Step</Form.Label>
                <Form.Control as="select" onChange={(e)=>timeStep = e.target.value}>    
                    <option>Daily</option> 
                    <option>Weekly</option> 
                    <option>Monthly</option> 
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={(event) => getData(search, timeStep)}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={10}>
            <div className="chart-container ">
              {drawChart()}
            </div>
          </Col>                
        </Row>
      </Container>
    
      
      <div className="footer">

      </div>
    </div>
  );
}

export default App;
