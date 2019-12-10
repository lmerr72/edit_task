import React from 'react';
import {FormattedMessage} from 'react-intl';
import { MDBDataTable} from 'mdbreact';
import 'react-dropdown/style.css';
import Form from 'react-bootstrap/Form';
import { Col, Button } from 'react-bootstrap';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {Typeahead} from 'react-bootstrap-typeahead';
//import Modal from 'react-bootstrap/Modal';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
      
    this.state = {
      log: [],
      errorMsg: "",
      records: [], // replace data
      categories: [],
      users: [],
      columns: [
            {
            label: 'Changes',
            field: 'changes',
            sort: 'asc',
            width: 150
            },
            {
            label: 'Date Modified',
            field: 'date',
            sort: 'asc',
            width: 270
        }]
    }     

    this.fetchUsers = this.fetchUsers.bind(this);
    this.fetchLog = this.fetchLog.bind(this);
    this.fetchRecords = this.fetchRecords.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.renderCategoryField = this.renderCategoryField.bind(this);
  }
        
  // change to async fetch on dropdown?
  fetchUsers() {      
    // add error handling
    const url =  "http://localhost:4000/users"
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        this.setState({users:data})
      })
      .catch(err => {console.log(err)
          this.setState({errorMsg:"Failed to retrieve users"})
       })
  }
    
  fetchRecords() {
    // add error handling
    const url =  "http://localhost:4000/records"
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        this.setState({records:data})
      })
      .catch(err => {console.log(err)
          this.setState({errorMsg:"Failed to retrieve associated records"})
      })
  }
    
  fetchCategories() {
    // revisit data structure to store parent and child category ids
    const url =  "http://localhost:4000/categories"
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        this.setState({categories:data})
      })
      .catch(err => {console.log(err)
          this.setState({errorMsg:"Failed to retrieve categories"})
      })
  }
    
  fetchLog() {
    if (!this.props.id) {
        return;
    }
    const url =  ("http://localhost:4000/log?task_id=" + this.props.id)
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        if (data && data.length > 0) {
            let rows = data.map((item,index) => {
                return {
                    changes: <div><span className="greentext">•</span> <span className="boldtext">{item.editor}</span> changed <span className="boldtext">{item.changed_field}</span> from <span className="greentext">{item.old_val}</span> to <span className="greentext">{item.new_val}</span></div>,
                    date: item.date
                }
            });
            return rows;
        }
      })
      .catch(err => {
        console.log(err)
        return []               
      })
  }
    
  renderCategoryField() {
      // change to recursively load all child categories from parent when selected
      return "";
      
      /*
      return (<Form.Control as="select" name="categories" value={this.props.task.categories} onChange={this.props.onChange}>
          <option>Category 1</option>
          <option>Category 2</option>
      </Form.Control>);
              
      */
  }
    
  onFileUpload() {
      return;
      // store externally with link to attached file id in task data structure
  }
    
  componentDidMount() {
    // fetch all data from mocked api
    this.fetchUsers();
    this.fetchRecords();
    this.fetchCategories();
    this.fetchLog(); // ensure task id is set
    // 
    //this.generateRandomData(20); 
  }  
        
  generateRandomData = (range) => {
    // sample fields to pull dummy data from
    const users = ['Bill Johnson','Phil Thompson','Jill Smith','Kim Miller','Tim Jones','Jim Smith']
    const status = ['Canceled','Completed','Active'];
    const types = ['Customer','Internal'];
    const departments = ['Sales','Accounting','HR','IT'];
      
    let records = [];
    function randomDate(start, end) {
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options); // change hardcoding from US to client input
    }
      
    for (let i=0; i<range;i++) {
      records.push({
        id: Math.floor(Math.random() * 100000000),
        creator: users[Math.floor(Math.random() * Math.floor(users.length))],
        date_created: randomDate(new Date(2016, 0, 1), new Date()),
        requestor_type: types[Math.floor(Math.random() * Math.floor(types.length))],
        requestor: users[Math.floor(Math.random() * Math.floor(users.length))],
        department: departments[Math.floor(Math.random() * Math.floor(departments.length))],
        status: status[Math.floor(Math.random() * Math.floor(status.length))],
        requested_by_date: "01/01/2019",
        requested_by_time: "10:10",
        due_date: randomDate(new Date(2016, 0, 1), new Date()),
        due_time: "11:11",
        associated_records: [],
        categories: []
      })
    }
    
    // json-server does not support bulk insert
    // run once to generate dummy data
    for (let i=0; i<records.length;i++) {
        const url =  "http://localhost:4000/tasks"
      
        fetch(url, {
            method: 'POST', 
            headers: {
            'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(records[i]) 
        })
        .then(response => response.json())
        .then(data => {}) 
        .catch(err => console.log(err))
    }
  }
    
  render()  {    
    // need to change to async to wait for logs to fetch
    const data = {
        columns: this.state.columns,
        rows: this.fetchLog()
    };
      
    return ( 
        <div id="editModal" className="modal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel"
          aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <button type="button" className="close" onClick={e => {
              this.props.onClose && this.props.onClose(e);
           }} data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
                <h5 className="modal-title" id="editModalLabel">
                     <FormattedMessage id="title" defaultMessage="Edit Task"/>
                </h5>
                <hr/>
              <Form onSubmit={this.props.onSave}>
              <div className="modal-body">
                <span className="required-field">{this.state.errorMsg}</span>
                <FormattedMessage id="modal_title" defaultMessage="EDITABLE FIELDS"/>
                <p></p>
                      <Form.Row>
                        <Form.Group as={Col} controlId="creator">
                          <Form.Label><span className="required-field">*</span> Creator</Form.Label>
                          <Form.Control
                            type="text"
                            name="creator"
                            required
                            value={this.props.task.creator}
                            onChange={this.props.onChange}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="requestor_type">
                          <Form.Label>Requestor Type</Form.Label>
                          <Form.Control as="select" name="requestor_type" value={this.props.task.requestor_type} onChange={this.props.onChange}>
                              <option>Customer</option>
                              <option>Internal</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="requestor">
                          <Form.Label><span className="required-field">*</span> Requestor</Form.Label>
                          <Typeahead
                              id="requestor"
                              labelKey="name"
                              required
                              emptyLabel="No users found"
                              placeholder="Select a requestor"
                              options={this.state.users}
                              selected={this.props.task.requestor}
                              onChange={(selected) => this.props.onRequestorChange(selected[0])}
                              filterBy={(option, props) => {
                                let filter = (this.props.task && this.props.task.requestor_type) ? this.props.task.requestor_type : "Customer";
                                return option.role === filter;
                              }}
                              placeholder="Choose a requestor"
                            />
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group as={Col} controlId="department">
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            type="text"
                            name="department"
                            value={this.props.task.department}
                            onChange={this.props.onChange}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="status">
                          <Form.Label>Status</Form.Label>
                          <Form.Control as="select" value={this.props.task.status} name="status" onChange={this.props.onChange}>
                              <option>Active</option>
                              <option>Completed</option>
                              <option>Canceled</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group as={Col} controlId="requested_by_date">
                          <Form.Label>Requested By Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="requested_by_date"
                            value={this.props.task.requested_by_date}
                            onChange={this.props.onChange}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="requested_by_time">
                          <Form.Label>Requested By Time</Form.Label>
                          <Form.Control
                            type="time"
                            name="requested_by_time"
                            value={this.props.task.requested_by_time}
                            onChange={this.props.onChange}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="due_date">
                          <Form.Label>Due Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="due_date"
                            value={this.props.task.due_date}
                            onChange={this.props.onChange}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="due_time">
                          <Form.Label>Due Time</Form.Label>
                          <Form.Control
                            type="time"
                            name="due_time"
                            value={this.props.task.due_time}
                            onChange={this.props.onChange}
                          />
                        </Form.Group>
                      </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="category">
                          <Form.Label>Category</Form.Label>
                            {this.renderCategoryField()}
                        </Form.Group>
                      <Form.Group as={Col} controlId="associated_records">
                          <Form.Label>Associated Records</Form.Label>
                          <Typeahead
                              id="associated_records"
                              multiple
                              onChange={this.props.onRecordChange}
                              labelKey="title"
                              options={this.state.records}
                              placeholder="Choose a record"
                            />
                      </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group>
                            <Form.Label>Upload File</Form.Label>
                            <div className="input-group">
                              <div className="custom-file">
                                <input
                                  type="file"
                                  className="custom-file-input"
                                  id="associatedFile"
                                  aria-describedby="associatedFile"
                                />
                                <label className="custom-file-label" htmlFor="associatedFile">
                                  Choose file
                                </label>
                              </div>
                            </div>
                        </Form.Group>
                      </Form.Row>
                  <p></p>
                    <FormattedMessage id="audit_log" defaultMessage="AUDIT LOG"/><p></p>
                    <MDBDataTable
                      borderless
                      displayEntries={false}
                      noBottomColumns
                      responsive
                      sortable
                      hover
                      exportToCSV
                      noRecordsFoundLabel="No changes have been made"
                      data={data}
                      order={['date', 'asc']} // fix sort
                    />
              </div>
              <div className="modal-footer">
                <Button variant="primary" onClick={this.props.onClear} className="btn modal-tertiary" >
                        <span className="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>  Clear Fields
                      </Button>
                  
                <Button variant="primary" className="btn modal-primary" type="submit">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>  Save Edit
                      </Button>
              </div>
            </Form>
            </div>
          </div>
        </div>
    );
  }
}

/*  replace with cliipboard glyph <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> */