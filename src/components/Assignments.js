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
  Alert,
  Tabs,
  Tab
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Assignments() {
  var { authFetch } = useAuth();

  var [bases, setBases] = useState([]);
  var [equipTypes, setEquipTypes] = useState([]);
  var [activeTab, setActiveTab] = useState(0);
  var [message, setMessage] = useState("");
  var [messageType, setMessageType] = useState("success");
  var [assignBaseId, setAssignBaseId] = useState("");
  var [assignEquipId, setAssignEquipId] = useState("");
  var [assignPersonnel, setAssignPersonnel] = useState("");
  var [assignQuantity, setAssignQuantity] = useState("");
  var [assignDate, setAssignDate] = useState("");
  var [assignments, setAssignments] = useState([]);
  var [expendBaseId, setExpendBaseId] = useState("");
  var [expendEquipId, setExpendEquipId] = useState("");
  var [expendQuantity, setExpendQuantity] = useState("");
  var [expendReason, setExpendReason] = useState("");
  var [expendDate, setExpendDate] = useState("");
  var [expenditures, setExpenditures] = useState([]);

  useEffect(function () {
    loadDropdowns();
    loadAssignments();
    loadExpenditures();
  }, []);

  var loadDropdowns = async function () {
    var basesRes = await authFetch("/api/dashboard/bases");
    var equipRes = await authFetch("/api/dashboard/equipment-types");
    if (basesRes) setBases(await basesRes.json());
    if (equipRes) setEquipTypes(await equipRes.json());
  };

  var loadAssignments = async function () {
    var response = await authFetch("/api/assignments");
    if (response) setAssignments(await response.json());
  };

  var loadExpenditures = async function () {
    var response = await authFetch("/api/assignments/expenditures");
    if (response) setExpenditures(await response.json());
  };

  var handleAssignSubmit = async function (e) {
    e.preventDefault();
    setMessage("");

    var response = await authFetch("/api/assignments", {
      method: "POST",
      body: JSON.stringify({
        base_id: assignBaseId,
        equipment_type_id: assignEquipId,
        personnel_name: assignPersonnel,
        quantity: Number(assignQuantity),
        date: assignDate
      })
    });

    if (response && response.ok) {
      setMessage("Assignment recorded!");
      setMessageType("success");
      setAssignBaseId("");
      setAssignEquipId("");
      setAssignPersonnel("");
      setAssignQuantity("");
      setAssignDate("");
      loadAssignments();
    } else if (response) {
      var errorData = await response.json();
      setMessage("Error: " + errorData.error);
      setMessageType("error");
    }
  };
  var handleExpendSubmit = async function (e) {
    e.preventDefault();
    setMessage("");

    var response = await authFetch("/api/assignments/expenditures", {
      method: "POST",
      body: JSON.stringify({
        base_id: expendBaseId,
        equipment_type_id: expendEquipId,
        quantity: Number(expendQuantity),
        reason: expendReason,
        date: expendDate
      })
    });

    if (response && response.ok) {
      setMessage("Expenditure recorded!");
      setMessageType("success");
      setExpendBaseId("");
      setExpendEquipId("");
      setExpendQuantity("");
      setExpendReason("");
      setExpendDate("");
      loadExpenditures();
    } else if (response) {
      var errorData = await response.json();
      setMessage("Error: " + errorData.error);
      setMessageType("error");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Assignments & Expenditures
      </Typography>
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={function (e, newValue) { setActiveTab(newValue); setMessage(""); }}
        >
          <Tab label="Assignments" />
          <Tab label="Expenditures" />
        </Tabs>
      </Card>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {activeTab === 0 && (
        <>
        
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assign Asset to Personnel
              </Typography>

              <form onSubmit={handleAssignSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Base"
                      select
                      fullWidth
                      size="small"
                      value={assignBaseId}
                      onChange={function (e) { setAssignBaseId(e.target.value); }}
                      required
                    >
                      <MenuItem value="">Select Base</MenuItem>
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
                      value={assignEquipId}
                      onChange={function (e) { setAssignEquipId(e.target.value); }}
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

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Personnel Name"
                      fullWidth
                      size="small"
                      value={assignPersonnel}
                      onChange={function (e) { setAssignPersonnel(e.target.value); }}
                      placeholder="e.g. Sgt. Martinez"
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Quantity"
                      type="number"
                      fullWidth
                      size="small"
                      value={assignQuantity}
                      onChange={function (e) { setAssignQuantity(e.target.value); }}
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      size="small"
                      value={assignDate}
                      onChange={function (e) { setAssignDate(e.target.value); }}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{ height: "40px", backgroundColor: "#0f3460" }}
                    >
                      Record Assignment
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment History
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Base</strong></TableCell>
                      <TableCell><strong>Equipment</strong></TableCell>
                      <TableCell><strong>Personnel</strong></TableCell>
                      <TableCell><strong>Quantity</strong></TableCell>
                      <TableCell><strong>Recorded By</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No assignments found</TableCell>
                      </TableRow>
                    ) : (
                      assignments.map(function (item) {
                        return (
                          <TableRow key={item._id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.base_id ? item.base_id.name : ""}</TableCell>
                            <TableCell>{item.equipment_type_id ? item.equipment_type_id.name : ""}</TableCell>
                            <TableCell>{item.personnel_name}</TableCell>
                            <TableCell><strong>{item.quantity}</strong></TableCell>
                            <TableCell>{item.created_by ? item.created_by.full_name : ""}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
      {activeTab === 1 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Record Expenditure
              </Typography>

              <form onSubmit={handleExpendSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Base"
                      select
                      fullWidth
                      size="small"
                      value={expendBaseId}
                      onChange={function (e) { setExpendBaseId(e.target.value); }}
                      required
                    >
                      <MenuItem value="">Select Base</MenuItem>
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
                      value={expendEquipId}
                      onChange={function (e) { setExpendEquipId(e.target.value); }}
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

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Quantity"
                      type="number"
                      fullWidth
                      size="small"
                      value={expendQuantity}
                      onChange={function (e) { setExpendQuantity(e.target.value); }}
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Reason"
                      fullWidth
                      size="small"
                      value={expendReason}
                      onChange={function (e) { setExpendReason(e.target.value); }}
                      placeholder="e.g. Training exercise"
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      size="small"
                      value={expendDate}
                      onChange={function (e) { setExpendDate(e.target.value); }}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{ height: "40px", backgroundColor: "#0f3460" }}
                    >
                      Record Expenditure
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expenditure History
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Base</strong></TableCell>
                      <TableCell><strong>Equipment</strong></TableCell>
                      <TableCell><strong>Quantity</strong></TableCell>
                      <TableCell><strong>Reason</strong></TableCell>
                      <TableCell><strong>Recorded By</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenditures.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No expenditures found</TableCell>
                      </TableRow>
                    ) : (
                      expenditures.map(function (item) {
                        return (
                          <TableRow key={item._id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.base_id ? item.base_id.name : ""}</TableCell>
                            <TableCell>{item.equipment_type_id ? item.equipment_type_id.name : ""}</TableCell>
                            <TableCell><strong>{item.quantity.toLocaleString()}</strong></TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell>{item.created_by ? item.created_by.full_name : ""}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}

export default Assignments;
