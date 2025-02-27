import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:easy_sms_receiver/easy_sms_receiver.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'Constants.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SMS Monitor',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const SMSListenerApp(),
    );
  }
}

class SMSListenerApp extends StatefulWidget {
  const SMSListenerApp({super.key});

  @override
  State<SMSListenerApp> createState() => _SMSListenerAppState();
}

class _SMSListenerAppState extends State<SMSListenerApp> {
  final EasySmsReceiver easySmsReceiver = EasySmsReceiver.instance;
  String _easySmsReceiverStatus = "Undefined";
  String _message = "";
  String _userEmail = "";
  String _userId = "";
  String _authToken = "";
  bool _isLoggedIn = false;
  bool _isEmailSent = false;
  String _backendUrl = "";
  Position? _currentPosition;
  String _locationStatus = "Not fetched";

  final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      printTime: true,
    ),
  );

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  final TextEditingController _urlController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _checkPreviousLogin();
    _requestLocationPermission();
    startSmsReceiver();
  }

  Future<void> _requestLocationPermission() async {
    try {
      _logger.i('Requesting location permissions');

      // Request multiple permissions
      final statuses = await [
        Permission.location,
        Permission.locationWhenInUse,
        Permission.locationAlways
      ].request();

      // Detailed permission handling
      bool allGranted = statuses.values.every((status) => status.isGranted);

      if (allGranted) {
        _logger.i('All location permissions granted');
        _showSnackBar('Location permissions granted successfully');
        await _getCurrentLocation();
      } else {
        _logger.w('Location permissions partially denied');
        _showLocationPermissionDialog();
      }
    } catch (e) {
      _logger.e('Permission request error', error: e);
      _showSnackBar('Error requesting location permissions');
    }
  }

  Future<void> _showLocationPermissionDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Location Permissions Required'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                const Text('This app requires location permissions to:'),
                const SizedBox(height: 10),
                const Text('• Track SMS location context'),
                const Text('• Provide accurate geolocation data'),
                const Text('• Enhance security features'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Open App Settings'),
              onPressed: () {
                openAppSettings();
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Request Permissions'),
              onPressed: () {
                Navigator.of(context).pop();
                _requestLocationPermission();
              },
            ),
          ],
        );
      },
    );
  }

  Future<Position?> _getCurrentLocation() async {
    try {
      _logger.i('Starting location retrieval process');

      // Comprehensive permission check
      var locationPermission = await Geolocator.checkPermission();
      if (locationPermission == LocationPermission.denied) {
        _logger.w('Location permission denied, requesting permission');
        locationPermission = await Geolocator.requestPermission();

        if (locationPermission == LocationPermission.denied) {
          _logger.e('Location permission still denied');
          _showLocationPermissionDialog();
          setState(() => _locationStatus = "Location permission denied");
          return null;
        }
      }

      if (locationPermission == LocationPermission.deniedForever) {
        _logger.e('Location permissions permanently denied');
        _showLocationPermissionDialog();
        setState(
            () => _locationStatus = "Location permissions permanently denied");
        return null;
      }

      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _logger.w('Location services are disabled');
        await _showLocationServicesDialog();
        setState(() => _locationStatus = "Location services are disabled");
        return null;
      }

      // Fetch location with detailed logging and timeout
      try {
        _logger.i('Attempting to get current position');
        Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
          timeLimit: const Duration(seconds: 15),
        );

        _logger.i('Location successfully retrieved: '
            'Lat: ${position.latitude}, Lon: ${position.longitude}, '
            'Accuracy: ${position.accuracy}');

        setState(() {
          _locationStatus = "Location successfully fetched";
          _currentPosition = position;
        });

        return position;
      } catch (e) {
        _logger.e('Location retrieval error', error: e);
        setState(() => _locationStatus = "Error getting location: $e");
        _showLocationRetrievalErrorDialog(e);
        return null;
      }
    } catch (e) {
      _logger.e('Unexpected location error', error: e);
      setState(() => _locationStatus = "Unexpected location error: $e");
      return null;
    }
  }

  Future<void> _showLocationServicesDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Location Services Disabled'),
          content: const SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Location services are currently disabled. '
                    'Would you like to enable them?'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Open Location Settings'),
              onPressed: () {
                Geolocator.openLocationSettings();
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _showLocationRetrievalErrorDialog(dynamic error) {
    showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Location Retrieval Failed'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                const Text('Unable to retrieve your current location.'),
                const SizedBox(height: 10),
                Text('Error Details: ${error.toString()}'),
                const SizedBox(height: 10),
                const Text('Possible reasons:'),
                const Text('• GPS is turned off'),
                const Text('• No internet connection'),
                const Text('• Device location services are restricted'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Retry'),
              onPressed: () {
                Navigator.of(context).pop();
                _getCurrentLocation();
              },
            ),
            TextButton(
              child: const Text('Open Settings'),
              onPressed: () {
                Geolocator.openLocationSettings();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _checkPreviousLogin() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userEmail = prefs.getString('userEmail') ?? "";
      _userId = prefs.getString('userId') ?? "";
      _authToken = prefs.getString('authToken') ?? "";
      _backendUrl = prefs.getString('backendUrl') ?? "";
      _isLoggedIn = _authToken.isNotEmpty;
    });
    _urlController.text = _backendUrl;
  }

  Future<void> _sendOtp() async {
    if (_backendUrl.isEmpty) {
      _showSnackBar('Please set server URL first');
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': _emailController.text.trim()}),
      );

      if (response.statusCode == 200) {
        setState(() => _isEmailSent = true);
        _showSnackBar('OTP sent to your email');
      } else {
        _showSnackBar('Failed to send OTP');
      }
    } catch (error) {
      print('OTP send error: $error');
      _showSnackBar('Error sending OTP');
    }
  }

  Future<void> _verifyOtp() async {
    if (_backendUrl.isEmpty) {
      _showSnackBar('Please set server URL first');
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailController.text.trim(),
          'otp': _otpController.text.trim(),
        }),
      );

      final responseBody = json.decode(response.body);

      if (response.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userEmail', _emailController.text.trim());
        await prefs.setString('userId', responseBody['userId']);
        await prefs.setString('authToken', responseBody['token']);

        setState(() {
          _isLoggedIn = true;
          _userEmail = _emailController.text.trim();
          _userId = responseBody['userId'];
          _authToken = responseBody['token'];
          _isEmailSent = false;
        });

        _showSnackBar('Successfully verified');
      } else {
        _showSnackBar(responseBody['error'] ?? 'Invalid OTP');
      }
    } catch (error) {
      print('OTP verify error: $error');
      _showSnackBar('Error verifying OTP');
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userEmail');
    await prefs.remove('userId');
    await prefs.remove('authToken');

    setState(() {
      _isLoggedIn = false;
      _userEmail = "";
      _userId = "";
      _authToken = "";
      _emailController.clear();
      _otpController.clear();
    });
  }

  Future<void> _sendSmsToBackend(String? message, String? address) async {
    if (message == null || !_isLoggedIn || _backendUrl.isEmpty) return;

    try {
      final position = await _getCurrentLocation();

      final response = await http
          .post(
            Uri.parse('$_backendUrl/api/sms'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $_authToken'
            },
            body: jsonEncode({
              'userId': _userId,
              'message': message,
              'sender': address,
              'timestamp': DateTime.now().toIso8601String(),
              'location': position != null
                  ? {
                      'latitude': position.latitude,
                      'longitude': position.longitude,
                      'accuracy': position.accuracy,
                    }
                  : null,
            }),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        print('SMS with location sent successfully');
      } else {
        print('Failed to send SMS: ${response.statusCode}');
      }
    } catch (e) {
      print('Error sending SMS: $e');
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<void> startSmsReceiver() async {
    final smsStatus = await Permission.sms.status;
    final locationStatus = await Permission.location.status;

    if (smsStatus.isGranted && locationStatus.isGranted) {
      easySmsReceiver.listenIncomingSms(
        onNewMessage: (message) {
          if (!mounted) return;

          setState(() => _message = message.body ?? "Error reading message");
          _sendSmsToBackend(message.body, message.address);
        },
      );

      setState(() => _easySmsReceiverStatus = "Running");
    } else {
      final result = await [
        Permission.sms,
        Permission.location,
      ].request();

      if (result[Permission.sms]!.isGranted &&
          result[Permission.location]!.isGranted) {
        startSmsReceiver();
      } else {
        _showSnackBar('Permissions required');
      }
    }
  }

  void stopSmsReceiver() {
    easySmsReceiver.stopListenIncomingSms();
    setState(() => _easySmsReceiverStatus = "Stopped");
  }

  Future<void> _saveBackendUrl() async {
    if (!_formKey.currentState!.validate()) return;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('backendUrl', _urlController.text.trim());
    setState(() => _backendUrl = _urlController.text.trim());
    _showSnackBar('Server URL saved successfully');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SMS Monitor'),
        actions: [
          if (_isLoggedIn)
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: _logout,
              tooltip: 'Logout',
            )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Server Configuration',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _urlController,
                        decoration: const InputDecoration(
                          labelText: 'Backend URL',
                          prefixIcon: Icon(Icons.link),
                          hintText: 'https://your-server.com/api',
                        ),
                        keyboardType: TextInputType.url,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a server URL';
                          }
                          if (!value.startsWith('http')) {
                            return 'Enter a valid URL';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      Align(
                        alignment: Alignment.centerRight,
                        child: FilledButton.icon(
                          icon: const Icon(Icons.save),
                          label: const Text('Save URL'),
                          onPressed: _saveBackendUrl,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            if (_backendUrl.isNotEmpty && !_isLoggedIn) ...[
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          prefixIcon: Icon(Icons.email),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 16),
                      if (!_isEmailSent)
                        FilledButton.icon(
                          icon: const Icon(Icons.send),
                          label: const Text('Send OTP'),
                          onPressed: _sendOtp,
                        ),
                      if (_isEmailSent) ...[
                        TextField(
                          controller: _otpController,
                          decoration: const InputDecoration(
                            labelText: 'OTP Code',
                            prefixIcon: Icon(Icons.lock_clock),
                          ),
                          keyboardType: TextInputType.number,
                        ),
                        const SizedBox(height: 16),
                        FilledButton.icon(
                          icon: const Icon(Icons.verified_user),
                          label: const Text('Verify OTP'),
                          onPressed: _verifyOtp,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
            if (_isLoggedIn) ...[
              const SizedBox(height: 20),
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Service Status',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ListTile(
                        leading: const Icon(Icons.sms),
                        title: const Text('SMS Monitoring'),
                        subtitle: Text(_easySmsReceiverStatus),
                        trailing: Switch(
                          value: _easySmsReceiverStatus == "Running",
                          onChanged: (value) {
                            value ? startSmsReceiver() : stopSmsReceiver();
                          },
                        ),
                      ),
                      ListTile(
                        leading: const Icon(Icons.location_on),
                        title: const Text('Location Service'),
                        subtitle: Text(_locationStatus),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Latest Message',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _message.isNotEmpty ? _message : 'No messages received',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
