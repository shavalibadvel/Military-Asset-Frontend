import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  var { authFetch } = useAuth();
  var [startDate, setStartDate] = useState("");
  var [endDate, setEndDate] = useState("");
  var [baseId, setBaseId] = useState("");
  var [equipmentTypeId, setEquipmentTypeId] = useState("");
  var [metrics, setMetrics] = useState(null);
  var [bases, setBases] = useState([]);
  var [equipTypes, setEquipTypes] = useState([]);
  var [loading, setLoading] = useState(true);
  var [popupOpen, setPopupOpen] = useState(false);
  useEffect(function () {
    loadDropdowns();
  }, []);

  useEffect(function () {
    loadMetrics();
  }, [startDate, endDate, baseId, equipmentTypeId]);
  var loadDropdowns = async function () {
    var basesResponse = await authFetch("/api/dashboard/bases");
    var equipResponse = await authFetch("/api/dashboard/equipment-types");

    if (basesResponse) {
      var basesData = await basesResponse.json();
      setBases(basesData);
    }

    if (equipResponse) {
      var equipData = await equipResponse.json();
      setEquipTypes(equipData);
    }
  };

  var loadMetrics = async function () {
    setLoading(true);

    var params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (baseId) params.append("baseId", baseId);
    if (equipmentTypeId) params.append("equipmentTypeId", equipmentTypeId);

    var response = await authFetch("/api/dashboard/metrics?" + params.toString());

    if (response) {
      var data = await response.json();
      setMetrics(data);
    }

    setLoading(false);
  };

  if (loading && !metrics) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="From Date"
                type="date"
                fullWidth
                size="small"
                value={startDate}
                onChange={function (e) { setStartDate(e.target.value); }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="To Date"
                type="date"
                fullWidth
                size="small"
                value={endDate}
                onChange={function (e) { setEndDate(e.target.value); }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Base"
                select
                fullWidth
                size="small"
                value={baseId}
                onChange={function (e) { setBaseId(e.target.value); }}
              >
                <MenuItem value="">All Bases</MenuItem>
                {bases.map(function (base) {
                  return (
                    <MenuItem key={base._id} value={base._id}>
                      {base.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Equipment Type"
                select
                fullWidth
                size="small"
                value={equipmentTypeId}
                onChange={function (e) { setEquipmentTypeId(e.target.value); }}
              >
                <MenuItem value="">All Types</MenuItem>
                {equipTypes.map(function (equip) {
                  return (
                    <MenuItem key={equip._id} value={equip._id}>
                      {equip.category} - {equip.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {metrics && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  OPENING BALANCE
                </Typography>
                <Typography variant="h4">
                  {metrics.openingBalance.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  CLOSING BALANCE
                </Typography>
                <Typography variant="h4">
                  {metrics.closingBalance.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{ cursor: "pointer", "&:hover": { boxShadow: 4 } }}
              onClick={function () { setPopupOpen(true); }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  NET MOVEMENT (click for details)
                </Typography>
                <Typography variant="h4" color="primary">
                  {metrics.netMovement.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  ASSIGNED
                </Typography>
                <Typography variant="h4">
                  {metrics.assigned.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  EXPENDED
                </Typography>
                <Typography variant="h4">
                  {metrics.expended.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <Dialog open={popupOpen} onClose={function () { setPopupOpen(false); }}>
        <DialogTitle>
          Net Movement Breakdown
          <IconButton
            onClick={function () { setPopupOpen(false); }}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {metrics && (
          <DialogContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Typography>Purchases</Typography>
              <Typography color="green">
                +{metrics.purchases.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Typography>Transfers In</Typography>
              <Typography color="green">
                +{metrics.transfersIn.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Typography>Transfers Out</Typography>
              <Typography color="error">
                -{metrics.transfersOut.toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Typography variant="h6">Net Movement</Typography>
              <Typography variant="h6">
                {metrics.netMovement.toLocaleString()}
              </Typography>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}

export default Dashboard;
