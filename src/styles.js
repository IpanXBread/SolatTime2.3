import { StyleSheet, PixelRatio } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    backgroundColor: '#1A1A1A',
    flex: 1,
  },
  container2: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    alignItems: 'flex-end',
  },
  container3:{
    padding: 7, // Adjust padding to your preference
    margin: 2,
    height: 35, // Adjust height to your preference
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10, // Add border radius for rounded corners
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:250,
  },
  container4: {
    alignItems: 'center',
    backgroundColor:'#e5e5e5',
    justifyContent: 'center',
    padding:4,
    borderRadius:7,
    margin:5,
    marginHorizontal:10,
    height:40,
  },
  container5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container6: {
    flex: 1 ,
    marginTop: 5,
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius:15,
    width:'80%',
    alignSelf:'center',
    zIndex: 2,
    position: 'relative',
  },
  container7: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft:5,
    marginRight:5,
    marginTop:5,
    padding:7,
    backgroundColor:'rgba(255, 255, 255, 0.2)',
    width:"100%",
    height:50,
  },
  inviContainer:{
    padding:4,
    margin:5,
  },
  box: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 15,
    borderRadius: 30,
    marginTop:10,
    width:"95%",
    alignItems: 'center',
  },
  leftBox: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    margin: 10,
    borderRadius: 5,
    width:"90%",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color:'white',
    paddingLeft:20,
  },
  title2:{
    fontSize: 20,
    paddingTop:20,
    marginLeft:20,
    marginTop: 5,
    color:'white',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
    textAlign:'center',
  },
  textRight: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'right',
    flex:1,
  },
  textSmall: {
    color: '#fff',
    fontSize: 13,
    justifyContent: 'center',
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '90%',
    color: '#000000',
    borderRadius:5,
    overflow:'hidden',
    backgroundColor:'rgba(255, 255, 255, 0.5)',
    paddingHorizontal:10,
    alignSelf:'center',
  },
  input2: {
    height: 35,
    width: '15%',
    marginLeft:10,
    color: '#000000',
    borderRadius:5,
    overflow:'hidden',
    backgroundColor:'lightgray',
    paddingHorizontal:10,
  },
  button: {
    backgroundColor: 'rgba(222, 209, 175, 0.3)', // 80% transparent gray
    borderColor: '#e2c675',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    height: 55,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallerButton: {
    backgroundColor: '#00131c', // set alpha to 0.9 for 90% opacity
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 5,
    height: 40,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },  
  smallerButton2: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // set alpha to 0.9 for 90% opacity
    height: 40,
    width: 40,
    marginTop:7,
    alignItems: 'center',
    justifyContent: 'center'
  },  
  createButton: {
    borderRadius: 40,
    padding: 10,
    marginHorizontal: 5,
    height:55,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
    width:120,
    alignItems:'center',
    justifyContent:'center',
    shadowColor: '#000', // shadow color
    shadowOffset: { width: 2, height: 2 }, // shadow offset
    shadowOpacity: 0.9, // shadow opacity
    shadowRadius: 14, // shadow radius
  },
  settingsButton: {
    right: 0,
    top: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 16, // Set width of overlay
    height: 16, // Set height of overlay
  },
  imageBackground: {
    flex: 1,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignSelf: 'center',
    margin: 10,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  inputContainer2: {
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loginButton2: {
    width: 200,
    height: 40,
    backgroundColor: '#2979FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  registerButton2: {
    width: 200,
    height: 40,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

  export default styles;