import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';



export default function PaymentsTable(props) {
    let statusLabel = props.type === "staging" ? "Staging Status" : "Payment Status"
    let statusKey = props.type === "staging" ? "stagingStatus" : "paymentStatus"


    const columns = [
        {
          width: 150,
          label: 'Employee Id',
          dataKey: 'employeeId',
        },
        {
          width: 120,
          label: 'Source Account',
          dataKey: 'srcAccountNumber',
          numeric: true,
        },
        {
          width: 120,
          label: 'Dest. Account',
          dataKey: 'destAccountNumber',
          numeric: true,
        },
        {
          width: 120,
          label: 'Amount (in cents)',
          dataKey: 'amount',
          numeric: true,
        },
        {
          width: 120,
          label: statusLabel,
          dataKey: statusKey,
          numeric: true,
        }
      ];
      
    
    const VirtuosoTableComponents = {
      Scroller: React.forwardRef((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
      )),
      Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
      ),
      TableHead,
      TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
      TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };
    
    function fixedHeaderContent() {
      return (
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.dataKey}
              variant="head"
              align={column.numeric || false ? 'right' : 'left'}
              style={{ width: column.width }}
              sx={{
                backgroundColor: 'background.paper',
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      );
    }
    
    function rowContent(_index, row) {
      return (
        <React.Fragment>
          {columns.map((column) => (
            <TableCell
              key={column.dataKey}
              align={column.numeric || false ? 'right' : 'left'}
            >
              {row[column.dataKey]}
            </TableCell>
          ))}
        </React.Fragment>
      );
    }


    console.log(props)
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        data={props.rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}