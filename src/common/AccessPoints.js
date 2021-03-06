
import React, {useState} from 'react';
import MaterialTable from "material-table";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import States from './States';

function AccessPoints(props) {
  const [value, setValue] = useState(props.defaultValue.map(p => {return {licState: p.state, licNum: p.license}}));
  const [error, setError] = useState("");

  const validate = (data) => {
      let err = [];
      if(!data.licState) {
          err.push("State is required.");
      }
      if(!data.licNum) {
          err.push("License # is required.");
      }
      if(err.length > 0) {
          setError(err);
          throw new Error(err);
      }
  };

  const handleAdd = async (newData) => {
      validate(newData);    
      setError("");
      const newValue = [...value, newData]; 
      setValue(newValue);
      if(props.onAdd) {
        props.onAdd({
            state: newData.licState,
            license: newData.licNum
        });
      }
  };
  const handleUpdate = async (newData, oldData) => {
      if(oldData) {
        validate(newData);
        setError("");
        const newValue = [...value]; 
        newValue[newValue.indexOf(oldData)] = newData;
        setValue(newValue);
        if(props.onUpdate) {
            props.onUpdate({
                state: newData.licState,
                license: newData.licNum
            });
        }
      }
  };
  const handleDelete = async (oldData) => {
    const newValue = [...value]; 
    setError("");
    newValue.splice(newValue.indexOf(oldData), 1);
    setValue(newValue);
    if(props.onDelete) {
        props.onDelete({
            state: oldData.licState
        });
    }
  };
  const stateLookup = States.reduce((map, state) => {
      map[state.Code] = state.State;
      return map;
  }, {});

  return( 
    <FormControl fullWidth>
        <MaterialTable
            disabled={props.disabled}
            columns={[
                { title: "State", field: "licState", lookup: stateLookup, editable: 'onAdd' },
                { title: "License #", field: "licNum" }
            ]}
            data={value}
            options={{
                paging: false,
                search: false,
                actionsColumnIndex: 2
            }}
            editable={props.disabled?{}:{
                onRowAdd: handleAdd,
                onRowUpdate: handleUpdate,
                onRowDelete: handleDelete,
            }}
            title={props.label}
        />
        <FormHelperText error>{error}</FormHelperText>
    </FormControl>
    );
}

AccessPoints.defaultProps = {
    id: 'access-points',
    label: 'Licensed States',
    variant: 'outlined',
    disabled: false,
    defaultValue: []
}

export default AccessPoints;
