import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ChoicesAppProps {}

interface ChoicesAppState {
  options: string[];
}

class ChoicesApp extends React.Component<ChoicesAppProps, ChoicesAppState> {
  state = {
    options: Array<string>(),
  };

  componentDidMount() {
    try {
      const json = localStorage.getItem('options');
      const options = JSON.parse(json);

      if (options) {
        this.setState(() => ({ options }));
      }
    } catch (e) {
      // Do nothing
    }
  }

  componentDidUpdate(prevProps: ChoicesAppProps, prevState: ChoicesAppState) {
    if (this.state.options.length !== prevState.options.length) {
      const json = JSON.stringify(this.state.options);

      localStorage.setItem('options', json);
    }

    console.log('Component Did Update');
  }

  componentWillUnmount() {
    console.log('Unmount');
  }

  handleDeleteOptions = () => {
    this.setState(() => ({ options: [] }));
  };

  handleDeleteOption = (option: string) => {
    this.setState((prevState) => ({
      options: prevState.options.filter((o) => o !== option),
    }));
  };

  handleRandomChoiceClick = (event: MouseEvent) => {
    const optionIndex = Math.floor(Math.random() * 3);
    const option = this.state.options[optionIndex];
    alert(option);
  };

  handleAddOption = (option: string) => {
    if (!option) {
      return 'Enter valid value to add item';
    } else if (this.state.options.indexOf(option) > -1) {
      return 'Option already exists';
    }

    this.setState((prevState) => ({
      options: prevState.options.concat(option),
    }));
  };

  render() {
    const title = 'Choices';
    const subtitle = 'Put your life in my hands';

    return (
      <div>
        <Header title={title} subtitle={subtitle} />
        <Action
          hasOptions={this.state.options.length > 0}
          onRandomChoiceClick={this.handleRandomChoiceClick}
        />
        <Options
          onDeleteOption={this.handleDeleteOption}
          onHandleDeleteOptions={this.handleDeleteOptions}
          options={this.state.options}
        />
        <AddOption onAddOption={this.handleAddOption} />
      </div>
    );
  }
}

interface HeaderProps {
  subtitle: string;
  title: string;
}

const Header = (props: HeaderProps) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <h2>{props.subtitle}</h2>
    </div>
  );
};

Header.defaultProps = {
  subtitle: 'Some Default',
};

interface ActionProps {
  hasOptions: boolean;
  onRandomChoiceClick: any;
}

const Action = (props: ActionProps) => {
  return (
    <div>
      <button disabled={!props.hasOptions} onClick={props.onRandomChoiceClick}>
        What should I do?
      </button>
    </div>
  );
};

interface OptionsProps {
  onDeleteOption: any;
  onHandleDeleteOptions: any;
  options: string[];
}

const Options = (props: OptionsProps) => {
  return (
    <div>
      <button onClick={props.onHandleDeleteOptions}>Remove All</button>
      {props.options.length === 0 && <p>Please add an option!</p>}
      {props.options.map((option) => (
        <Option
          key={Math.random()}
          onDeleteOption={props.onDeleteOption}
          text={option}
        />
      ))}
    </div>
  );
};

interface OptionProps {
  onDeleteOption: any;
  text: string;
}

const Option = (props: OptionProps) => {
  return (
    <div>
      {props.text}
      <button onClick={() => props.onDeleteOption(props.text)}>Delete</button>
    </div>
  );
};

interface AddOptionProps {
  onAddOption: Function;
}

interface AddOptionState {
  error: string;
}

class AddOption extends React.Component<AddOptionProps, AddOptionState> {
  state = {
    error: '',
  };

  handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();

    const formInputs = (e.target as HTMLFormElement).elements;
    const optionInput = formInputs['option'] as HTMLInputElement;
    const option = optionInput.value.trim();
    const error = this.props.onAddOption(option);

    this.setState(() => ({ error }));

    if (!error) {
      optionInput.value = '';
    }
  };

  render() {
    return (
      <div>
        {this.state.error && <p>{this.state.error}</p>}
        <form onSubmit={this.handleAddOption}>
          <input type="text" name="option" />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<ChoicesApp />, document.getElementById('root'));
