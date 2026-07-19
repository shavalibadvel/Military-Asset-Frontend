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

function Purchases() {
  var { authFetch } = useAuth();
  var [bases, setBases] = useState([]);
  var [equipTypes, setEquipTypes] = useState([]);
  var [formBaseId, setFormBaseId] = useState("");
  var [formEquipId, setFormEquipId] = useState("");
  var [formQuantity, setFormQuantity] = useState("");
  var [formDate, setFormDate] = useState("");
  var [formNotes, setFormNotes] = useState("");
  var [message, setMessage] = useState("");
  var [messageType, setMessageType] = useState("success");
  var [purchases, setPurchases] = useState([]);
  var [filterDate, setFilterDate] = useState("");
  var [filterEquip, setFilterEquip] = useState("");

  useEffect(function () {
    loadDropdowns();
    loadPurchases();
  }, []);
  useEffect(function () {
    loadPurchases();
  }, [filterDate, filterEquip]);

  var loadDropdowns = async function () {
    var basesRes = await authFetch("/api/dashboard/bases");
    var equipRes = await authFetch("/api/dashboard/equipment-types");

    if (basesRes) setBases(await basesRes.json());
    if (equipRes) setEquipTypes(await equipRes.json());
  };

  var loadPurchases = async function () {
    var params = new URLSearchParams();
    if (filterDate) params.append("startDate", filterDate);
    if (filterEquip) params.append("equipmentTypeId", filterEquip);

    var response = await authFetch("/api/purchases?" + params.toString());
    if (response) {
      var data = await response.json();
      setPurchases(data);
    }
  };

  var handleSubmit = async function (e) {
    e.preventDefault();
    setMessage("");

    var response = await authFetch("/api/purchases", {
      method: "POST",
      body: JSON.stringify({
        base_id: formBaseId,
        equipment_type_id: formEquipId,
        quantity: Number(formQuantity),
        date: formDate,
        notes: formNotes
      })
    });

    if (response && response.ok) {
      setMessage("Purchase recorded successfully!");
      setMessageType("success");
      setFormBaseId("");
      setFormEquipId("");
      setFormQuantity("");
      setFormDate("");
      setFormNotes("");
      loadPurchases();
    } else if (response) {
      var errorData = await response.json();
      setMessage("Error: " + errorData.error);
      setMessageType("error");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Purchases
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Record New Purchase
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
                  label="Base"
                  select
                  fullWidth
                  size="small"
                  value={formBaseId}
                  onChange={function (e) { setFormBaseId(e.target.value); }}
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
                  value={formEquipId}
                  onChange={function (e) { setFormEquipId(e.target.value); }}
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
                  value={formQuantity}
                  onChange={function (e) { setFormQuantity(e.target.value); }}
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
                  value={formDate}
                  onChange={function (e) { setFormDate(e.target.value); }}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Notes (optional)"
                  fullWidth
                  size="small"
                  value={formNotes}
                  onChange={function (e) { setFormNotes(e.target.value); }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ height: "40px", backgroundColor: "#0f3460" }}
                >
                  Record Purchase
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Purchase History
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filter by Date"
                type="date"
                fullWidth
                size="small"
                value={filterDate}
                onChange={function (e) { setFilterDate(e.target.value); }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filter by Equipment"
                select
                fullWidth
                size="small"
                value={filterEquip}
                onChange={function (e) { setFilterEquip(e.target.value); }}
              >
                <MenuItem value="">All Types</MenuItem>
                {equipTypes.map(function (equip) {
                  return <MenuItem key={equip._id} value={equip._id}>{equip.name}</MenuItem>;
                })}
              </TextField>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Base</strong></TableCell>
                  <TableCell><strong>Equipment</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Quantity</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                  <TableCell><strong>Recorded By</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No purchases found</TableCell>
                  </TableRow>
                ) : (
                  purchases.map(function (purchase) {
                    return (
                      <TableRow key={purchase._id}>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>{purchase.base_id ? purchase.base_id.name : ""}</TableCell>
                        <TableCell>{purchase.equipment_type_id ? purchase.equipment_type_id.name : ""}</TableCell>
                        <TableCell>{purchase.equipment_type_id ? purchase.equipment_type_id.category : ""}</TableCell>
                        <TableCell><strong>{purchase.quantity.toLocaleString()}</strong></TableCell>
                        <TableCell>{purchase.notes}</TableCell>
                        <TableCell>{purchase.created_by ? purchase.created_by.full_name : ""}</TableCell>
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

export default Purchases;
