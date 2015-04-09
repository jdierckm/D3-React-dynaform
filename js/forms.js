
function getFormData(refs) {
  var data = {}
  for (var key in refs) {
    if (refs.hasOwnProperty(key)) {
		var d = refs[key].getDOMNode();
		var v = d.value.trim();
		switch(d.type) {
		  case "radio" :
		    if(d.checked) {
			    data[d.name] = v;
		    }
			break;
		  case "checkbox" :
		    if(d.checked) {
				if(!data[d.name]) {
					data[d.name] = [];
				}
			    data[d.name].push(v);
		    }
			break;
		  default : 
		    data[key] = v;
		    break;		
		}
    }
  }
  return data;
}

function clearFormData(refs) {
  for (var key in refs) {
    if (refs.hasOwnProperty(key)) {	
	  refs[key].getDOMNode().value = '';		
    }
  }
}

function textChange(e) {
	var x =1;
}

var UpdateableInput = React.createClass({
	getInitialState: function() {
      return {value: this.props.initialValue, checked: this.props.initialChecked};
    },
  
    handleChange: function(event) {
      this.setState({value: event.target.value, checked : event.target.value.checked});
     },
	 
	render: function() {
      var value = this.state.value;
	  var checked = this.state.checked;
      if (checked){
					       return <input type={this.props.type} placeholder={this.props.placeholder} value={value} name={this.props.name} onChange={this.handleChange} checked>{this.props.children}</input>; 
					    }else{
					       return <input type={this.props.type} placeholder={this.props.placeholder} value={value} name={this.props.name} onChange={this.handleChange}>{this.props.children}</input>; 
					    };	  
  }
});

var DynaForm = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
	var data = getFormData(this.refs);

	//TODO - validate data
	this.props.onSubmit(data);
   //clearFormData(this.refs);
  },
  render: function() {
	  var data = this.props.data;
	  var checker;
    return (
      <form className="dynaForm" onSubmit={this.handleSubmit} >
	      <h3>{this.props.title}</h3>
		  {this.props.inputs.map(function(input,i) {
			  switch(input.type) {
				case "radio" :
				   checker = function(val) { return input.ref&&(data[input.ref]===val);};
				   //note: no break; I'm falling thru here
                case "checkbox" :	
                    checker = function(val) {return input.ref&&data[input.ref]&&(data[input.ref].indexOf(val)>=0);	}			
				    return <div class="choice">{input.caption+":"}<div class="choice-options">{input.options.map(function(option,j) {
					    
					       return <div class="form.input"><UpdateableInput type={input.type} ref={input.ref+"-"+j} key={input.ref+"-"+j} initialValue={option.value} name={input.ref}  initialChecked={checker(option.value)}>{option.label}</UpdateableInput></div>; 
					})}</div></div>
                    break;
                default:
                    return <div class="form.input">{input.caption}:<UpdateableInput type={input.type} placeholder={input.placeholder} ref={input.ref} key={input.ref} initialValue={input && input.ref?data[input.ref]:input.value} name={input.ref} onChange={textChange}/></div>;
					break;		  
			  }  //end switch
		      })
          }
		        	 
		<input type="submit" value="Post" />  
      </form>
    );
  }
});


var inputs = [
{"type" : "text", "caption" : "Name", "placeholder" : "Field One", "ref" : "field1"},
{"type" : "number", "caption" : "Data", "ref" : "numField"},
{"type" : "date", "caption" : "Target Date", "placeholder" : "date field", "ref" : "field2", "value":"2015-02-01"},
];

//do a shallow copy merge of objects
var merge = function() {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};

//will hold all project related data
//var projData = {};

function  dynaSubmit(data) {
	  //alert("data=" + data.field1);
	  projData = merge(projData,data)
	  alert("data=" + JSON.stringify(projData));
}

//React.render(
//  <DynaForm inputs={inputs} onSubmit={dynaSubmit}/>,
//  document.getElementById('content')
//);