import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

/* Misc fixes/todos

- fix requestor field only showing first char
- selected prop error on typeahead
- change date / time form fields to datepickers
- category field
- file upload functionality
- saving bugs
- update README
- left justify search bar on  data table on chrome

*/

/* Tests to write
    ensure rerqested_by_type exists to populate user filter
    user types should match req. type
    x-ing out of the modal resets modal
    clear fields doesn't clear audit log or id
    can't save with empty required field
    field validation
    proper  error handnling on api fetches
*/