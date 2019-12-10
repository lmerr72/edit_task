import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBInput } from 'mdbreact';
import EditModal from './EditModal';

class DatatablePage extends Component {
  constructor(props) {
    super(props);
      
    this.state = {
      editItem: {
        creator: "",
        date_created: "",
        requestor_type: "",
        requestor: "",
        department: "",
        status: "",
        requested_by_date: "",
        requested_by_time: "",
        due_date: "",
        due_time: "",
        associated_records: [],
        categories: []
      }, 
      id: "",
      tasks: [],
      users: {},
      showModal: false,
      rows: [],
      columns: [
          {
            label: 'DATE CREATED',
            field: 'date_created',
            sort: 'asc',
            width: 150
          },
          {
            label: 'REQUESTOR TYPE',
            field: 'requestor_type',
            sort: 'asc',
            width: 270
          },
          {
            label: 'REQUESTOR',
            field: 'requestor',
            sort: 'asc',
            width: 200
          },
          {
            label: 'DEPARTMENT',
            field: 'department',
            sort: 'asc',
            width: 100
          },
          {
            label: 'STATUS',
            field: 'status',
            sort: 'asc',
            width: 150
          },
          {
            label: 'ACTIONS',
            field: 'actions',
            sort: 'asc',
            width: 100
          }
        ]
    }
      
    this.startEdit = this.startEdit.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRequestorChange = this.handleRequestorChange.bind(this);
    this.handleRecordChange = this.handleRecordChange.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }
    
  fetchTasks() {
    let url =  "http://localhost:4000/tasks"  
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        const tasks = data
        let rows = data.map((item, index) => {
            return {
              check: <MDBInput label="" type="checkbox" id="checkbox1" />,
              date_created: <div><MDBBtn color="#00bbb0" size="sm"><span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></MDBBtn>{item.date_created}</div>,
              requestor_type: item.requestor_type,
              requestor: item.requestor,
              department: item.department,
              status: <button className={"btn btn-primary status-" + item.status.toLowerCase()}>{item.status}</button>,
              actions: <div><button className="btn btn-action"><span className="glyphicon glyphicon-send" aria-hidden="true"></span></button>{" "}<button className="btn btn-action" data-toggle="modal" data-target="#editModal"
                      onClick={() => this.startEdit(index)}><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></div>
            }
        })
        this.setState({tasks:tasks,rows:rows});
    })
  }
    
  componentDidMount() {
    // fetch tasks from mocked api
    this.fetchTasks();
  }
    
  startEdit(index) {
    if (!this.state.tasks || !this.state.tasks[index]) {
        return;    
    }
      
    let task = this.state.tasks[index];
      
    // need error handling if get request fails or is invalid data
    let editItem = {
        creator: task.creator,
        status: task.status,
        associated_records: task.associated_records,
        categories: task.categories,
        department: task.department,
        requestor: task.requestor,
        requested_by_type: task.requested_by_type,
        due_date: task.due_date,
        due_time: task.due_time,
        requested_by_date: task.requested_by_date,
        requested_by_time: task.requested_by_time
    }
      
    this.setState({
        editItem: editItem,
        showModal: true,
        id: task.id
    });
  }
    
  saveEdit(event) {
    //event.preventDefault();  
    const newTask = this.state.editItem;
    const url =  "http://localhost:4000/tasks/" + newTask.id  
      
    fetch(url, {
        method: 'PUT', 
        headers: {
        'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(data => {
        // reload task table on succeses
        this.refreshTable();
        this.cancelEdit();
    }) 
    .catch(err => {
        console.log(err)
        // prevent closing of modal to show error message
    })
  }

  cancelEdit(index) {
    this.setState({
      editItem: {},
      showModal: false
    });
  }
    
  clearFields() {
      let cleanTask = this.state.editItem;
      
      // consolidate 
      cleanTask.creator = "";
      cleanTask.status = "Active";
      cleanTask.associated_records = [];
      cleanTask.categories = [];
      cleanTask.department = "";
      cleanTask.requestor = "";
      cleanTask.requested_by_type = "Customer";
      cleanTask.due_date = "";
      cleanTask.due_time = "";
      cleanTask.requested_by_date = "";
      cleanTask.requested_by_time = "";
      
      this.setState({cleanTask});
  }
    
  handleChange(e) { 
    const target = e.target;
      
    let key = this.state.editItem;
    key[target.name] = target.value;

    this.setState({key});
  }
    
  handleRequestorChange(val) {         
    let key = this.state.editItem;
      
    key['requestor'] = val['name'];


    this.setState({key});
  }

  // TODO set input box heigh to auto adjust on multiple entry in modal
  handleRecordChange(val) {         
    let key = this.state.editItem;
    key['associated_records'] = val;
    this.setState({key});
  }
    
  refreshTable(index) {
    // refresh new datatable
    this.cancelEdit();
    this.fetchTasks();
  }

  render() {  
    const data = {
        columns: this.state.columns,
        rows: this.state.rows
    };
      
    return (
      <div>
        <MDBDataTable
          bordered
          noBottomColumns
          displayEntries={false}
          hover
          data={data}
          order={['date_created', 'asc']}
        />
        <EditModal
            open={this.state.showModal}
            id={this.state.id}
            users={this.state.users} 
            task={this.state.editItem}
            onSave={this.saveEdit} 
            onRequestorChange={this.handleRequestorChange}
            onRecordChange={this.handleRecordChange}
            onChange={this.handleChange}
            onClear={this.clearFields}
            onClose={this.cancelEdit}>
        </EditModal>
      </div>
    );
  }
}

export default DatatablePage;