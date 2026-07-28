package com.verdantiq.backend;

import com.verdantiq.backend.repository.ActivityLogRepository;
import com.verdantiq.backend.repository.UserRepository;
import com.verdantiq.backend.service.MetricsVisualizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class MetricsVisualizationServiceTest {

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private MetricsVisualizationService metricsVisualizationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should generate chart-ready time series data for energy")
    void getTimeSeriesChartData_Energy() {
        List<Map<String, Object>> series = metricsVisualizationService.getTimeSeriesChartData("energy");

        assertNotNull(series);
        assertFalse(series.isEmpty());
        assertTrue(series.get(0).containsKey("date"));
        assertTrue(series.get(0).containsKey("actual"));
        assertTrue(series.get(0).containsKey("predicted"));
        assertEquals("kWh", series.get(0).get("unit"));
    }

    @Test
    @DisplayName("Should generate chart-ready time series data for water")
    void getTimeSeriesChartData_Water() {
        List<Map<String, Object>> series = metricsVisualizationService.getTimeSeriesChartData("water");

        assertNotNull(series);
        assertFalse(series.isEmpty());
        assertEquals("gallons", series.get(0).get("unit"));
    }

    @Test
    @DisplayName("Should assemble system telemetry with database ping and ML error logs")
    void getSystemTelemetry_Success() {
        when(userRepository.count()).thenReturn(42L);
        when(activityLogRepository.count()).thenReturn(1500L);

        Map<String, Object> telemetry = metricsVisualizationService.getSystemTelemetry();

        assertNotNull(telemetry);
        assertEquals("HEALTHY", telemetry.get("status"));
        assertEquals(42L, telemetry.get("totalRegisteredUsers"));
        assertEquals(1500L, telemetry.get("totalActivityLogsCount"));
        assertTrue(telemetry.containsKey("mlModelTrainingErrorHistory"));
    }
}
