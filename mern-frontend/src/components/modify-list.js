import React, {Component} from 'react';
import axios from 'axios';

export default class UpdateList extends Component {
    constructor(props) {
        super(props);
        
        this.changeInventory = this.changeInventory.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        
        this.state = {
            inventory: [], 
            amount: ''
        }
    }

    // Starting lifecycle and calling for data from database
    componentDidMount() {
        axios.get('http://localhost:4000/inv/')
        .then(response => {
            this.setState({inventory: response.data});
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    // Helper function to change state value
    onChangeAmount(e) {
        this.setState({
            amount: e.target.value
        });
    }

    // Helper function to change state value, since is array must create copy and modify copy
    onChangeQuantity(e, index) {
        const newQuantity = this.state.inventory.slice()
        newQuantity[index].quantity = e
        this.setState({
            inventory: newQuantity
        })
    }

    // Function for clicking button
    changeInventory(id, amount, quantity, index){
        var newQuantity = Number(quantity) + Number(amount)
        
        // Setting up object to be sent in patch request
        const obj = {
            quantity: newQuantity
        }
        
        // After patch has been confirmed to database change state to change component
        axios.patch('http://localhost:4000/inv/'+id, obj)
        .then(res =>{
            // Helper function to change state to trigger component lifecycle
            this.onChangeQuantity(newQuantity, index)
            console.log(res.data)  
        });
        
    }

    // Creating function to map out data and create input/buttons
    inventoryList = (inventory) =>{
        return inventory.map((inventory, index) => (
            <tr>
                <td>{inventory.description}</td>
                <td>{inventory.quantity}</td>
                <td>
                <input type='number' name="amount"
                onChange={this.onChangeAmount}/>
                </td>
                <td>
                    <div class="btn-toolbar">
                        <button type="button" id='btnRestock' class="btn-primary btn-sm" onClick={() => this.changeInventory(inventory._id, this.state.amount, inventory.quantity, index)}>Restock</button>
                        <button type="button" id='btnUse' class="btn-danger btn-sm" onClick={() => this.changeInventory(inventory._id, -this.state.amount, inventory.quantity, index)}>Use</button>
                    </div>
                
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <div>
                <h3>Restock/Use</h3>
                <table className="table table-striped table-bordered table-hover" style={{marginTop:20}}>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Current Quantity</th>
                            <th>Change Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.inventoryList(this.state.inventory)}
                        </tbody>
                </table>
            </div>
        )
    }
}