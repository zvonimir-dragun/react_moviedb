import React, { Component } from 'react';
import ActorInfo from "../elements/ActorInfo/ActorInfo";
import { API_URL, API_KEY } from "../../config";


class ActorBio extends Component {
  state = {
    name: "",
    birthday: null,
    loading: false
  };

  componentDidMount() {
    if (localStorage.getItem(`${this.props.match.params.person_id}`)) {
      const state = JSON.parse(
        localStorage.getItem(`${this.props.match.params.person_id}`)
      );
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      // First fetch the movie ...
      const endpoint = `${API_URL}actorbio/${this.props.match.params.person_id}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchItems = endpoint => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        console.log(result);
        if (result.status_code) {
          this.setState({ loading: false });
        } else {
          this.setState({ movie: result }, () => {
            // ... then fetch actors in the setState callback function
            const endpoint = `${API_URL}actor/${this.props.match.params.personId}/credits?api_key=${API_KEY}`;
            fetch(endpoint)
              .then(result => result.json())
              .then(result => {
                const directors = result.crew.filter(
                  member => member.job === "Director"
                );

                this.setState(
                  {
                    actorImage: result.profile_path,
                    name: result.name,
                    birthday: result.birthday,
                    loading: false
                  },
                  () => {
                    localStorage.setItem(
                      `${this.props.match.params.movieId}`,
                      JSON.stringify(this.state)
                    );
                  }
                );
              });
          });
        }
      })
      .catch(error => console.error("Error:", error));
  };

  render() {
    return (
      <div className="rmdb-movie">
        {this.state.movie ? (
          <div>
            <ActorInfo birthday={this.state.birthday} name={this.state.name} />
          </div>
        ) : null}

      </div>
    );
  }
}

export default ActorBio;