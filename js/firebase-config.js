/* ================================================================
   ARNAV FLIGHTS — Firebase Config + Local Demo Fallback
   ================================================================
   HOW TO USE REAL FIREBASE:
   1. Create a Firebase project at https://console.firebase.google.com
   2. Enable Authentication (Email/Password) and Firestore Database
   3. Replace the values in FIREBASE_CONFIG below with your project's config
   4. Set Firestore security rules for your project
   ================================================================ */

'use strict';

/* ── Admin Credentials ──────────────────────────────────────────── */
const ADMIN_EMAIL    = 'admin@arnavflights.com';
const ADMIN_PASSWORD = 'Admin@123';

/* ── Firebase Config ────────────────────────────────────────────── */
/* Replace with your actual Firebase config to enable cloud sync     */
const firebaseConfig = {
  apiKey: "AIzaSyDey7lMbrkQ_3JE4Sa6CMg-HMIGJTZELeA",
  authDomain: "flight-booking-4b8ee.firebaseapp.com",
  projectId: "flight-booking-4b8ee",
  storageBucket: "flight-booking-4b8ee.firebasestorage.app",
  messagingSenderId: "132622177118",
  appId: "1:132622177118:web:a7fad17b747010ff0af5cf"
};


const IS_PLACEHOLDER = firebaseConfig.apiKey.startsWith('YOUR_');

/* ================================================================
   DEMO MODE — Full localStorage-based Auth & Database
   ================================================================ */

class DemoAuth {
  constructor() {
    this._listeners = [];
    this.currentUser = null;
    this._seedData();
    this._restore();
  }

  _seedData() {
    /* ── Seed users ────────────────────────────────────────────── */
    const users = JSON.parse(localStorage.getItem('af_users') || '[]');
    const seeds = [
      { uid:'admin_001', email:ADMIN_EMAIL, password:ADMIN_PASSWORD,
        displayName:'Super Admin', isAdmin:true, phone:'+91 99999 00000',
        createdAt:'2024-01-01T00:00:00Z', status:'active', bookingCount:0,
        photoURL:null, city:'New Delhi', country:'India' },
      { uid:'user_001', email:'demo@arnavflights.com', password:'Demo@1234',
        displayName:'Demo User', isAdmin:false, phone:'+91 98765 43210',
        createdAt:'2024-02-01T00:00:00Z', status:'active', bookingCount:3,
        photoURL:null, city:'Mumbai', country:'India' },
      { uid:'user_002', email:'rahul@example.com', password:'Test@1234',
        displayName:'Rahul Mehta', isAdmin:false, phone:'+91 98123 45678',
        createdAt:'2024-02-10T00:00:00Z', status:'active', bookingCount:5,
        photoURL:null, city:'Mumbai', country:'India' },
      { uid:'user_003', email:'priya@example.com', password:'Test@1234',
        displayName:'Priya Sharma', isAdmin:false, phone:'+91 91234 56789',
        createdAt:'2024-02-15T00:00:00Z', status:'active', bookingCount:2,
        photoURL:null, city:'New Delhi', country:'India' },
      { uid:'user_004', email:'aditya@example.com', password:'Test@1234',
        displayName:'Aditya Kumar', isAdmin:false, phone:'+91 87654 32109',
        createdAt:'2024-02-18T00:00:00Z', status:'suspended', bookingCount:1,
        photoURL:null, city:'Bengaluru', country:'India' },
    ];
    let dirty = false;
    seeds.forEach(s => { if (!users.find(u => u.email === s.email)) { users.push(s); dirty = true; } });
    if (dirty) localStorage.setItem('af_users', JSON.stringify(users));

    /* ── Seed bookings ─────────────────────────────────────────── */
    if (!localStorage.getItem('af_bookings')) {
      localStorage.setItem('af_bookings', JSON.stringify([
        { id:'BK001', userId:'user_001', userEmail:'demo@arnavflights.com',
          userName:'Demo User', from:'DEL', to:'BOM', airline:'Air India',
          flightNum:'AI-301', dep:'06:15', arr:'09:30', travelDate:'2024-03-10',
          cls:'Economy', amount:5782, status:'confirmed', bookedAt:'2024-02-18T10:30:00Z' },
        { id:'BK002', userId:'user_002', userEmail:'rahul@example.com',
          userName:'Rahul Mehta', from:'BOM', to:'DXB', airline:'Emirates',
          flightNum:'EK-232', dep:'09:05', arr:'11:35', travelDate:'2024-03-15',
          cls:'Business', amount:22500, status:'confirmed', bookedAt:'2024-02-19T14:00:00Z' },
        { id:'BK003', userId:'user_003', userEmail:'priya@example.com',
          userName:'Priya Sharma', from:'DEL', to:'SIN', airline:'Singapore Airlines',
          flightNum:'SQ-407', dep:'23:55', arr:'08:20', travelDate:'2024-03-20',
          cls:'Economy', amount:33500, status:'confirmed', bookedAt:'2024-02-19T16:00:00Z' },
        { id:'BK004', userId:'user_002', userEmail:'rahul@example.com',
          userName:'Rahul Mehta', from:'DEL', to:'LHR', airline:'British Airways',
          flightNum:'BA-117', dep:'10:25', arr:'15:40', travelDate:'2024-04-01',
          cls:'Economy', amount:62000, status:'pending', bookedAt:'2024-02-20T09:00:00Z' },
        { id:'BK005', userId:'user_004', userEmail:'aditya@example.com',
          userName:'Aditya Kumar', from:'BLR', to:'DEL', airline:'Air India',
          flightNum:'AI-506', dep:'16:50', arr:'22:10', travelDate:'2024-02-21',
          cls:'Economy', amount:5100, status:'cancelled', bookedAt:'2024-02-15T11:00:00Z' },
        { id:'BK006', userId:'user_001', userEmail:'demo@arnavflights.com',
          userName:'Demo User', from:'DEL', to:'DXB', airline:'Emirates',
          flightNum:'EK-508', dep:'14:30', arr:'17:05', travelDate:'2024-04-10',
          cls:'Business', amount:18500, status:'confirmed', bookedAt:'2024-02-21T08:00:00Z' },
        { id:'BK007', userId:'user_003', userEmail:'priya@example.com',
          userName:'Priya Sharma', from:'BOM', to:'HYD', airline:'IndiGo',
          flightNum:'6E-4523', dep:'18:30', arr:'21:10', travelDate:'2024-04-05',
          cls:'Economy', amount:2400, status:'confirmed', bookedAt:'2024-02-22T12:00:00Z' },
      ]));
    }

    /* ── Seed admin flights (editable via admin dashboard) ──────── */
    if (!localStorage.getItem('af_admin_flights')) {
      localStorage.setItem('af_admin_flights', JSON.stringify([
        { id:'F001', airline:'Air India', code:'AI', color:'ai-color', flightNum:'AI-301',
          dep:'06:15', arr:'09:30', depCode:'DEL', arrCode:'BOM', duration:'2h 15m',
          stops:0, price:4850, originalPrice:6200, cls:'Economy',
          baggage:'15kg', refundable:true, status:'active' },
        { id:'F002', airline:'IndiGo', code:'IG', color:'ig-color', flightNum:'6E-2401',
          dep:'08:45', arr:'11:50', depCode:'DEL', arrCode:'BOM', duration:'2h 05m',
          stops:0, price:3200, originalPrice:4100, cls:'Economy',
          baggage:'15kg', refundable:false, status:'active' },
        { id:'F003', airline:'SpiceJet', code:'SG', color:'sg-color', flightNum:'SG-801',
          dep:'11:20', arr:'14:40', depCode:'DEL', arrCode:'BOM', duration:'2h 20m',
          stops:0, price:2950, originalPrice:3800, cls:'Economy',
          baggage:'15kg', refundable:false, status:'active' },
        { id:'F004', airline:'Emirates', code:'EK', color:'ek-color', flightNum:'EK-508',
          dep:'14:30', arr:'17:05', depCode:'DEL', arrCode:'DXB', duration:'3h 35m',
          stops:0, price:18500, originalPrice:24000, cls:'Business',
          baggage:'30kg', refundable:true, status:'active' },
        { id:'F005', airline:'Lufthansa', code:'LH', color:'lh-color', flightNum:'LH-762',
          dep:'02:15', arr:'08:40', depCode:'DEL', arrCode:'FRA', duration:'8h 25m',
          stops:0, price:52000, originalPrice:68000, cls:'Economy',
          baggage:'23kg', refundable:true, status:'active' },
        { id:'F006', airline:'Singapore Airlines', code:'SQ', color:'sq-color', flightNum:'SQ-407',
          dep:'23:55', arr:'08:20', depCode:'DEL', arrCode:'SIN', duration:'5h 25m',
          stops:0, price:32000, originalPrice:42000, cls:'Economy',
          baggage:'30kg', refundable:true, status:'active' },
        { id:'F007', airline:'Qatar Airways', code:'QR', color:'qr-color', flightNum:'QR-551',
          dep:'03:40', arr:'07:00', depCode:'BOM', arrCode:'DOH', duration:'4h 50m',
          stops:0, price:22000, originalPrice:29000, cls:'Business',
          baggage:'30kg', refundable:true, status:'active' },
        { id:'F008', airline:'British Airways', code:'BA', color:'ba-color', flightNum:'BA-117',
          dep:'10:25', arr:'15:40', depCode:'DEL', arrCode:'LHR', duration:'9h 15m',
          stops:0, price:61000, originalPrice:78000, cls:'Economy',
          baggage:'23kg', refundable:true, status:'active' },
        { id:'F009', airline:'Air India', code:'AI', color:'ai-color', flightNum:'AI-506',
          dep:'16:50', arr:'22:10', depCode:'BLR', arrCode:'DEL', duration:'2h 20m',
          stops:0, price:5100, originalPrice:6800, cls:'Economy',
          baggage:'15kg', refundable:true, status:'active' },
        { id:'F010', airline:'IndiGo', code:'IG', color:'ig-color', flightNum:'6E-4523',
          dep:'18:30', arr:'21:10', depCode:'BOM', arrCode:'HYD', duration:'1h 40m',
          stops:0, price:2400, originalPrice:3100, cls:'Economy',
          baggage:'15kg', refundable:false, status:'active' },
        { id:'F011', airline:'Emirates', code:'EK', color:'ek-color', flightNum:'EK-232',
          dep:'09:05', arr:'11:35', depCode:'BOM', arrCode:'DXB', duration:'3h 30m',
          stops:0, price:15800, originalPrice:21000, cls:'Economy',
          baggage:'25kg', refundable:true, status:'active' },
        { id:'F012', airline:'SpiceJet', code:'SG', color:'sg-color', flightNum:'SG-422',
          dep:'07:00', arr:'09:45', depCode:'DEL', arrCode:'MAA', duration:'2h 45m',
          stops:1, price:3600, originalPrice:4900, cls:'Economy',
          baggage:'15kg', refundable:false, status:'inactive' },
      ]));
    }
  }

  _restore() {
    try {
      const saved = localStorage.getItem('af_currentUser');
      if (saved) this.currentUser = JSON.parse(saved);
    } catch {}
    setTimeout(() => this._notify(), 60);
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.currentUser); } catch {} }); }

  onAuthStateChanged(callback) {
    this._listeners.push(callback);
    setTimeout(() => { try { callback(this.currentUser); } catch {} }, 60);
    return () => { this._listeners = this._listeners.filter(l => l !== callback); };
  }

  async signInWithEmailAndPassword(email, password) {
    await this._delay(500); // Realistic feel
    const users = JSON.parse(localStorage.getItem('af_users') || '[]');
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!u) throw Object.assign(new Error('Invalid email or password.'), { code: 'auth/invalid-credential' });
    if (u.status === 'suspended') throw Object.assign(new Error('This account has been suspended. Contact support.'), { code: 'auth/user-disabled' });
    this.currentUser = this._pub(u);
    localStorage.setItem('af_currentUser', JSON.stringify(this.currentUser));
    this._notify();
    return { user: this.currentUser };
  }

  async createUserWithEmailAndPassword(email, password) {
    await this._delay(600);
    const users = JSON.parse(localStorage.getItem('af_users') || '[]');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw Object.assign(new Error('An account with this email already exists.'), { code: 'auth/email-already-in-use' });
    }
    const uid = 'user_' + Date.now();
    const nu = { uid, email, password, displayName: email.split('@')[0],
      isAdmin: false, phone: '', createdAt: new Date().toISOString(),
      status: 'active', bookingCount: 0, photoURL: null, city: '', country: 'India' };
    users.push(nu);
    localStorage.setItem('af_users', JSON.stringify(users));
    this.currentUser = this._pub(nu);
    localStorage.setItem('af_currentUser', JSON.stringify(this.currentUser));
    this._notify();
    return { user: this.currentUser };
  }

  async signOut() {
    await this._delay(200);
    this.currentUser = null;
    localStorage.removeItem('af_currentUser');
    this._notify();
  }

  async updateProfile(updates) {
    if (!this.currentUser) return;
    Object.assign(this.currentUser, updates);
    localStorage.setItem('af_currentUser', JSON.stringify(this.currentUser));
    const users = JSON.parse(localStorage.getItem('af_users') || '[]');
    const i = users.findIndex(u => u.uid === this.currentUser.uid);
    if (i !== -1) Object.assign(users[i], updates);
    localStorage.setItem('af_users', JSON.stringify(users));
    this._notify();
  }

  async updatePassword(current, newPwd) {
    const users = JSON.parse(localStorage.getItem('af_users') || '[]');
    const i = users.findIndex(u => u.uid === this.currentUser?.uid);
    if (i === -1) throw new Error('User not found');
    if (users[i].password !== current) throw Object.assign(new Error('Current password is incorrect.'), { code: 'auth/wrong-password' });
    users[i].password = newPwd;
    localStorage.setItem('af_users', JSON.stringify(users));
  }

  _pub(u) {
    return { uid:u.uid, email:u.email, displayName:u.displayName, isAdmin:u.isAdmin,
      phone:u.phone||'', photoURL:u.photoURL||null, city:u.city||'', country:u.country||'India',
      createdAt:u.createdAt, status:u.status, bookingCount:u.bookingCount||0 };
  }

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}

/* ── Demo Database ──────────────────────────────────────────────── */
class DemoDB {
  _get(k)    { return JSON.parse(localStorage.getItem('af_' + k) || '[]'); }
  _set(k, v) { localStorage.setItem('af_' + k, JSON.stringify(v)); }

  /* Users */
  getUsers()      { return this._get('users').filter(u => !u.isAdmin); }
  getAllUsers()    { return this._get('users'); }
  getUser(uid)    { return this._get('users').find(u => u.uid === uid) || null; }
  updateUser(uid, d) {
    const a = this._get('users'), i = a.findIndex(u => u.uid === uid);
    if (i !== -1) { Object.assign(a[i], d); this._set('users', a); }
  }
  deleteUser(uid) { this._set('users', this._get('users').filter(u => u.uid !== uid)); }

  /* Bookings */
  getBookings()        { return this._get('bookings'); }
  getUserBookings(uid) { return this._get('bookings').filter(b => b.userId === uid); }
  updateBooking(id, d) {
    const a = this._get('bookings'), i = a.findIndex(b => b.id === id);
    if (i !== -1) { Object.assign(a[i], d); this._set('bookings', a); }
  }
  deleteBooking(id)    { this._set('bookings', this._get('bookings').filter(b => b.id !== id)); }
  addBooking(b) {
    const a = this._get('bookings');
    b.id = 'BK' + String(a.length + 1).padStart(3,'0');
    b.bookedAt = new Date().toISOString();
    a.push(b); this._set('bookings', a); return b.id;
  }

  /* Flights */
  getFlights()       { return this._get('admin_flights'); }
  getActiveFlights() { return this._get('admin_flights').filter(f => f.status === 'active'); }
  getFlight(id)      { return this._get('admin_flights').find(f => f.id === id) || null; }
  updateFlight(id, d) {
    const a = this._get('admin_flights'), i = a.findIndex(f => f.id === id);
    if (i !== -1) { Object.assign(a[i], d); this._set('admin_flights', a); }
  }
  addFlight(f) {
    const a = this._get('admin_flights');
    f.id = 'F' + String(a.length + 1).padStart(3,'0');
    a.push(f); this._set('admin_flights', a); return f.id;
  }
  deleteFlight(id) { this._set('admin_flights', this._get('admin_flights').filter(f => f.id !== id)); }

  /* Stats */
  getStats() {
    const users    = this._get('users').filter(u => !u.isAdmin);
    const bookings = this._get('bookings');
    const flights  = this._get('admin_flights');
    const conf     = bookings.filter(b => b.status === 'confirmed');
    const revenue  = conf.reduce((s, b) => s + (b.amount || 0), 0);
    return {
      totalUsers:          users.length,
      activeUsers:         users.filter(u => u.status === 'active').length,
      suspendedUsers:      users.filter(u => u.status === 'suspended').length,
      totalBookings:       bookings.length,
      confirmedBookings:   conf.length,
      pendingBookings:     bookings.filter(b => b.status === 'pending').length,
      cancelledBookings:   bookings.filter(b => b.status === 'cancelled').length,
      totalFlights:        flights.length,
      activeFlights:       flights.filter(f => f.status === 'active').length,
      revenue,
      recentBookings:      [...bookings].sort((a,b) => b.bookedAt?.localeCompare(a.bookedAt||'')).slice(0, 6),
    };
  }
}

/* ── Initialize af global ───────────────────────────────────────── */
window.af = {
  auth: null,
  db:   null,
  isDemo: true,
  currentUser: null,
  ADMIN_EMAIL,
};

(function bootstrap() {
  /* Always start with demo (instant, no network needed) */
  window.af.auth = new DemoAuth();
  window.af.db   = new DemoDB();
  window.af.isDemo = true;

  /* Try real Firebase in background if config is provided */
  if (IS_PLACEHOLDER) {
    console.info('[Arnav Flights] ℹ Demo Mode active. Replace FIREBASE_CONFIG to enable cloud sync.');
    return;
  }

  /* Attempt Firebase initialization */
  function tryFirebase() {
    if (typeof firebase === 'undefined') { console.warn('[Arnav Flights] Firebase SDK not loaded, staying in Demo Mode.'); return; }
    try {
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
      const fbAuth = firebase.auth();
      const fbDB   = firebase.firestore();

      /* Wrap Firebase to match our demo API */
      window.af.auth = {
        currentUser: null,
        onAuthStateChanged(cb) {
          return fbAuth.onAuthStateChanged(async user => {
            if (user) {
              try {
                const doc = await fbDB.collection('users').doc(user.uid).get();
                const data = doc.exists ? doc.data() : {};
                window.af.auth.currentUser = { uid:user.uid, email:user.email,
                  displayName: data.displayName || user.displayName || user.email.split('@')[0],
                  isAdmin: data.isAdmin || user.email === ADMIN_EMAIL,
                  phone: data.phone || '', photoURL: data.photoURL || null,
                  city: data.city || '', country: data.country || 'India',
                  createdAt: data.createdAt || '', status: data.status || 'active',
                  bookingCount: data.bookingCount || 0 };
              } catch { window.af.auth.currentUser = { uid:user.uid, email:user.email, displayName:user.displayName||'', isAdmin:user.email===ADMIN_EMAIL }; }
            } else { window.af.auth.currentUser = null; }
            window.af.currentUser = window.af.auth.currentUser;
            cb(window.af.auth.currentUser);
          });
        },
        async signInWithEmailAndPassword(e, p) { return fbAuth.signInWithEmailAndPassword(e, p); },
        async createUserWithEmailAndPassword(e, p) {
          const { user } = await fbAuth.createUserWithEmailAndPassword(e, p);
          await fbDB.collection('users').doc(user.uid).set({
            uid:user.uid, email:e, displayName:e.split('@')[0], isAdmin:false,
            phone:'', createdAt:new Date().toISOString(), status:'active', bookingCount:0 });
          return { user };
        },
        async signOut() { return fbAuth.signOut(); },
        async updateProfile(u) {
          const uid = fbAuth.currentUser?.uid;
          if (uid) await fbDB.collection('users').doc(uid).update(u);
        },
        async updatePassword(current, newPwd) {
          const cred = firebase.auth.EmailAuthProvider.credential(fbAuth.currentUser.email, current);
          await fbAuth.currentUser.reauthenticateWithCredential(cred);
          return fbAuth.currentUser.updatePassword(newPwd);
        },
      };

      window.af.db = {
        getUsers:        async () => { const s = await fbDB.collection('users').where('isAdmin','==',false).get(); return s.docs.map(d=>d.data()); },
        getAllUsers:      async () => { const s = await fbDB.collection('users').get(); return s.docs.map(d=>d.data()); },
        getUser:         async (uid) => { const d = await fbDB.collection('users').doc(uid).get(); return d.data(); },
        updateUser:      (uid,d) => fbDB.collection('users').doc(uid).update(d),
        deleteUser:      (uid)   => fbDB.collection('users').doc(uid).delete(),
        getBookings:     async () => { const s = await fbDB.collection('bookings').orderBy('bookedAt','desc').get(); return s.docs.map(d=>d.data()); },
        getUserBookings: async (uid) => { const s = await fbDB.collection('bookings').where('userId','==',uid).orderBy('bookedAt','desc').get(); return s.docs.map(d=>d.data()); },
        updateBooking:   (id,d) => fbDB.collection('bookings').doc(id).update(d),
        deleteBooking:   (id)   => fbDB.collection('bookings').doc(id).delete(),
        addBooking:      async (b) => { const r = fbDB.collection('bookings').doc(); await r.set({...b, id:r.id, bookedAt:new Date().toISOString()}); return r.id; },
        getFlights:      async () => { const s = await fbDB.collection('flights').get(); return s.docs.map(d=>d.data()); },
        getActiveFlights:async () => { const s = await fbDB.collection('flights').where('status','==','active').get(); return s.docs.map(d=>d.data()); },
        getFlight:       async (id) => { const d = await fbDB.collection('flights').doc(id).get(); return d.data(); },
        updateFlight:    (id,d) => fbDB.collection('flights').doc(id).update(d),
        addFlight:       async (f) => { const r = fbDB.collection('flights').doc(); await r.set({...f, id:r.id}); return r.id; },
        deleteFlight:    (id)   => fbDB.collection('flights').doc(id).delete(),
        getStats: async () => {
          const [us, bk, fl] = await Promise.all([
            fbDB.collection('users').where('isAdmin','==',false).get(),
            fbDB.collection('bookings').get(),
            fbDB.collection('flights').get()]);
          const bd = bk.docs.map(d=>d.data()), fd = fl.docs.map(d=>d.data());
          const conf = bd.filter(b=>b.status==='confirmed');
          return {
            totalUsers: us.size, activeUsers: us.size, suspendedUsers: 0,
            totalBookings: bd.length, confirmedBookings: conf.length,
            pendingBookings: bd.filter(b=>b.status==='pending').length,
            cancelledBookings: bd.filter(b=>b.status==='cancelled').length,
            totalFlights: fd.length, activeFlights: fd.filter(f=>f.status==='active').length,
            revenue: conf.reduce((s,b)=>s+(b.amount||0),0),
            recentBookings: bd.sort((a,b)=>b.bookedAt?.localeCompare(a.bookedAt||'')).slice(0,6),
          };
        },
      };

      window.af.isDemo = false;
      console.info('[Arnav Flights] ✅ Firebase connected.');
    } catch(e) {
      console.warn('[Arnav Flights] Firebase init failed, using Demo Mode:', e.message);
    }
  }

  if (typeof firebase !== 'undefined') { tryFirebase(); }
  else { window.addEventListener('firebaseLoaded', tryFirebase, { once: true }); }
})();
