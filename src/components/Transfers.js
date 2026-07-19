import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Alert
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Transfers() {
  var { authFetch } = useAuth();

  var [bases, setBases] = useState([]);
  var [equipTypes, setEquipTypes] = useState([]);
  var [fromBaseId, setFromBaseId] = useState("");
  var [toBaseId, setToBaseId] = useState("");
  var [equipId, setEquipId] = useState("");
  var [quantity, setQuantity] = useState("");
  var [date, setDate] = useState("");
  var [notes, setNotes] = useState("");

  var [message, setMessage] = useState("");
  var [messageType, setMessageType] = useState("success");
  var [transfers, setTransfers] = useState([]);

  useEffect(function () {
    loadDropdowns();
    loadTransfers();
  }, []);

  var loadDropdowns = async function () {
    var basesRes = await authFetch("/api/dashboard/bases");
    var equipRes = await authFetch("/api/dashboard/equipment-types");
    if (basesRes) setBases(await basesRes.json());
    if (equipRes) setEquipTypes(await equipRes.json());
  };

  var loadTransfers = async function () {
    var response = await authFetch("/api/transfers");
    if (response) {
      var data = await response.json();
      setTransfers(data);
    }
  };

  var handleSubmit = async function (e) {
    e.preventDefault();
    setMessage("");

    // Check: can't transfer to same base
    if (fromBaseId === toBaseId) {
      setMessage("Error: Source and destination base cannot be the same.");
      setMessageType("error");
      return;
    }

    var response = await authFetch("/api/transfers", {
      method: "POST",
      body: JSON.stringify({
        from_base_id: fromBaseId,
        to_base_id: toBaseId,
        equipment_type_id: equipId,
        quantity: Number(quantity),
        date: date,
        notes: notes
      })
    });

    if (response && response.ok) {
      setMessage("Transfer recorded successfully!");
      setMessageType("success");
      // Clear form
      setFromBaseId("");
      setToBaseId("");
      setEquipId("");
      setQuantity("");
      setDate("");
      setNotes("");
      loadTransfers();
    } else if (response) {
      var errorData = await response.json();
      setMessage("Error: " + errorData.error);
      setMessageType("error");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Transfers
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Record New Transfer
          </Typography>

          {message && (
            <Alert severity={messageType} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="From Base"
                  select
                  fullWidth
                  size="small"
                  value={fromBaseId}
                  onChange={function (e) { setFromBaseId(e.target.value); }}
                  required
                >
                  <MenuItem value="">Select Source</MenuItem>
                  {bases.map(function (base) {
                    return <MenuItem key={base._id} value={base._id}>{base.name}</MenuItem>;
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="To Base"
                  select
                  fullWidth
                  size="small"
                  value={toBaseId}
                  onChange={function (e) { setToBaseId(e.target.value); }}
                  required
                >
                  <MenuItem value="">Select Destination</MenuItem>
                  {bases.map(function (base) {
                    return <MenuItem key={base._id} value={base._id}>{base.name}</MenuItem>;
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Equipment"
                  select
                  fullWidth
                  size="small"
                  value={equipId}
                  onChange={function (e) { setEquipId(e.target.value); }}
                  required
                >
                  <MenuItem value="">Select Equipment</MenuItem>
                  {equipTypes.map(function (equip) {
                    return (
                      <MenuItem key={equip._id} value={equip._id}>
                        {equip.category} - {equip.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  size="small"
                  value={quantity}
                  onChange={function (e) { setQuantity(e.target.value); }}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  size="small"
                  value={date}
                  onChange={function (e) { setDate(e.target.value); }}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Notes (optional)"
                  fullWidth
                  size="small"
                  value={notes}
                  onChange={function (e) { setNotes(e.target.value); }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ height: "40px", backgroundColor: "#0f3460" }}
                >
                  Record Transfer
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Transfer History
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>From Base</strong></TableCell>
                  <TableCell><strong>To Base</strong></TableCell>
                  <TableCell><strong>Equipment</strong></TableCell>
                  <TableCell><strong>Quantity</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                  <TableCell><strong>Recorded By</strong></TableCell>
                  <TableCell><strong>Timestamp</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No transfers found</TableCell>
                  </TableRow>
                ) : (
                  transfers.map(function (transfer) {
                    return (
                      <TableRow key={transfer._id}>
                        <TableCell>{transfer.date}</TableCell>
                        <TableCell>{transfer.from_base_id ? transfer.from_base_id.name : ""}</TableCell>
                        <TableCell>{transfer.to_base_id ? transfer.to_base_id.name : ""}</TableCell>
                        <TableCell>{transfer.equipment_type_id ? transfer.equipment_type_id.name : ""}</TableCell>
                        <TableCell><strong>{transfer.quantity.toLocaleString()}</strong></TableCell>
                        <TableCell>{transfer.notes}</TableCell>
                        <TableCell>{transfer.created_by ? transfer.created_by.full_name : ""}</TableCell>
                        <TableCell>{new Date(transfer.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Transfers;
