import React, { Component } from "react";

import classes from "../SearchBar/SearchBar.module.css";

export default class extends Component {
  constructor(props){
    super(props);

    this.state = {
      inputValue: "",
      value: "group",
    };
  }

  inputHandler = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  handleSubmit = (e) => {
    this.props.search(this.state);
    e.preventDefault()
  }

  selectHandler = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={classes.Form}>
        <input
          name="searchValue"
          onChange={this.inputHandler}
          value={this.state.inputValue}
          type="search"
        />
        <select onChange={this.selectHandler} value={this.state.value}>
          <option value="group">Група</option>
          <option value="name">Име</option>
          <option value="supplier">Доставчик</option>
          <option value="sapcode">САП код</option>
        </select>
        <button type="submit">Filter!</button>
      </form>
    );
  }
}
