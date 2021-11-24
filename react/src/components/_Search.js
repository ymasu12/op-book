import React from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import * as Opu from '../OpUtils';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      informations: []
    };
  }
  
  doSearch() {
    console.log("検索開始");
    axios.get(
      "/api/information/search",
      {
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then((res) => {
        const data = res.data.data;
        for (let i = 0; i < data.informations.length; i++) {
          console.log(data.informations[i].name);
        }
        this.setState({
          text: "a",
          informations: data.informations,
        });
      })
      .catch((error) => {
        alert("エラーです！");
        console.log(error);
      });
  }
  
  render() {
    var list = [];
    for (let i = 0; i < this.state.informations.length; i++) {
      list.push(<li>{this.state.informations[i].text}</li>);
    }
    return (
      <div>
        Search!!<br/>
        <button onClick={() => this.doSearch()}>do search</button>
        <ul>
          { this.state.informations.map(information => <li key={information.puid}><Link to={Opu.InformationPath(information.puid)}>{information.name}</Link></li>)}
        </ul>
        <Link to={Opu.TopPath()}>Back To Top.</Link>
      </div>
    );
  }
}

export default Search;