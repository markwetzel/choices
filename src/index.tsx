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

  handleDeleteOptions = () => {
    this.setState(() => {
      return { options: [] };
    });
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

    this.setState((prevState) => {
      return {
        options: prevState.options.concat(option),
      };
    });
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

interface HeaderState {}

class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <h2>{this.props.subtitle}</h2>
      </div>
    );
  }
}

interface ActionProps {
  hasOptions: boolean;
  onRandomChoiceClick: any;
}

interface ActionState {}

class Action extends React.Component<ActionProps, ActionState> {
  render() {
    return (
      <div>
        <button
          disabled={!this.props.hasOptions}
          onClick={this.props.onRandomChoiceClick}
        >
          What should I do?
        </button>
      </div>
    );
  }
}

interface OptionsProps {
  onHandleDeleteOptions: any;
  options: string[];
}

interface OptionsState {}

class Options extends React.Component<OptionsProps, OptionsState> {
  render() {
    return (
      <div>
        <button onClick={this.props.onHandleDeleteOptions}>Remove All</button>
        {this.props.options.map((option) => (
          <Option key={Math.random()} text={option} />
        ))}
      </div>
    );
  }
}

interface OptionProps {
  text: string;
}

interface OptionState {}

class Option extends React.Component<OptionProps, OptionState> {
  render() {
    return <div>{this.props.text}</div>;
  }
}

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

    optionInput.value = '';
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
