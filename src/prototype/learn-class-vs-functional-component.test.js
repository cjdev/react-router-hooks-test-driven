import React from "react";
import {render} from "@testing-library/react";

class MyClassComponent extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

const MyFunctionalComponent = ({name}) => <h1>Hello, {name}</h1>

test('render class component', () => {
    const renderResult = render(<MyClassComponent name={'the-name'}/>)
    expect(renderResult.getByText('Hello, the-name')).toBeInTheDocument()

})

test('render functional component', () => {
    const renderResult = render(<MyFunctionalComponent name={'the-name'}/>)
    expect(renderResult.getByText('Hello, the-name')).toBeInTheDocument()
})
