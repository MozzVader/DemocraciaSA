// ============================================
// DEMOCRACIA S.A. — Authentication & Cloud Save
// ============================================

var SupabaseAuth = (function() {
  'use strict';

  var SUPABASE_URL = 'https://ixhbxiwshawebxvcrwxc.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4aGJ4aXdzaGF3ZWJ4dmNyd3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzM5NDYsImV4cCI6MjA5MzE0OTk0Nn0.XgojEBFNRMkJFMVV0n5_s1ltZChF65X0XHLkUeJO-rY';

  var client = null;
  var currentUser = null;
  var onAuthChange = null;

  // ---- Supabase Client Init ----

  function init() {
    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      client.auth.onAuthStateChange(function(event, session) {
        if (session && session.user) {
          currentUser = session.user;
        } else {
          currentUser = null;
        }
        if (onAuthChange) onAuthChange(currentUser);
      });
      // Check existing session
      client.auth.getSession().then(function(result) {
        if (result.data.session && result.data.session.user) {
          currentUser = result.data.session.user;
          if (onAuthChange) onAuthChange(currentUser);
        }
      });
    } catch (e) {
      console.error('Supabase init failed:', e);
    }
  }

  // ---- Auth Methods ----

  function signInWithEmail(email, password) {
    if (!client) return Promise.reject(new Error('Supabase no inicializado'));
    return client.auth.signInWithPassword({ email: email, password: password });
  }

  function signUpWithEmail(email, password) {
    if (!client) return Promise.reject(new Error('Supabase no inicializado'));
    return client.auth.signUp({ email: email, password: password });
  }

  function signInWithGoogle() {
    if (!client) return Promise.reject(new Error('Supabase no inicializado'));
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
  }

  function signOut() {
    if (!client) return Promise.reject(new Error('Supabase no inicializado'));
    return client.auth.signOut();
  }

  function getUser() {
    return currentUser;
  }

  function isLoggedIn() {
    return currentUser !== null;
  }

  function getUserEmail() {
    return currentUser ? (currentUser.email || '') : '';
  }

  // ---- Cloud Save / Load ----

  function cloudSave(gameState) {
    if (!client || !currentUser) return Promise.resolve(false);
    var saveData = Object.assign({}, gameState, {
      lastSave: Date.now(),
      lastTick: Date.now()
    });
    return client
      .from('saves')
      .upsert(
        { user_id: currentUser.id, state: saveData, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .then(function(result) {
        if (result.error) {
          console.error('Cloud save error:', result.error);
          return false;
        }
        return true;
      });
  }

  function cloudLoad() {
    if (!client || !currentUser) return Promise.resolve(null);
    return client
      .from('saves')
      .select('state')
      .eq('user_id', currentUser.id)
      .single()
      .then(function(result) {
        if (result.error || !result.data) return null;
        return result.data.state;
      });
  }

  // ---- Auth State Callback ----

  function setOnAuthChange(callback) {
    onAuthChange = callback;
  }

  // ---- Check if Supabase is ready ----

  function isReady() {
    return client !== null;
  }

  // Public API
  return {
    init: init,
    signInWithEmail: signInWithEmail,
    signUpWithEmail: signUpWithEmail,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    getUser: getUser,
    isLoggedIn: isLoggedIn,
    getUserEmail: getUserEmail,
    cloudSave: cloudSave,
    cloudLoad: cloudLoad,
    setOnAuthChange: setOnAuthChange,
    isReady: isReady
  };

})();
