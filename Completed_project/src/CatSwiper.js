import axios from "axios";
import styled from "@emotion/styled";
import React from "react";

const Wrapper = styled("div")`
  width: 500px;

  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const Button = styled("button")`
  display: block;
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
  border: 3px solid black;
  border-radius: 8px;
`;

const Loader = styled("div")`
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
  font-family: sans-serif;
  text-align: center;
`;

const Image = styled("img")`
  display: block;
  width: 100%;
`;

const makeUrl = () =>
  `${API_URL}/v1/images/search?limit=1&order=random&size=full`;

class CatSwiper extends React.Component {
  state = {
    currentCatUrl: null,
    loading: true
  };

  componentDidMount() {
    this.handleGetCat();
  }

  handleGetCat = () => {
    this.setState({ loading: true });
    axios
      .get(makeUrl())
      .then(res =>
        this.setState({ currentCatUrl: res.data[0].url, loading: false })
      )
      .catch(() => this.setState({ loading: false }));
  };

  render() {
    return (
      <Wrapper>
        <Button disabled={this.state.loading} onClick={this.handleGetCat}>
          Get another cat
        </Button>
        {this.state.loading ? (
          <Loader>Loading...</Loader>
        ) : (
          <Image src={this.state.currentCatUrl} />
        )}
      </Wrapper>
    );
  }
}

export default CatSwiper;
