pragma solidity ^0.4.0;
import "./Strings.sol";
import "./Integers.sol";

contract Verification {
    
    using Strings for *;
    using Integers for uint;

    // Store bank accounts with signature
    mapping(uint256 => string) public signatures;

    // constructor
    function Verification () public {
        
    }

    // method to insert new customer signature
    function addCustomerSignature (uint256 _bankAccount, string _signature) public {        
        signatures[_bankAccount] = _signature;
    }

    // method to retrieve customer signature
    function getCustomerSignature (uint256 _bankAccount) public view returns (string) {        
        return signatures[_bankAccount];
    }

    // method to verify customer signature
    function verifyCustomerSignature (string _message, address _account, string _signature) public  returns (bool) {
        // ecrecover of signature should be equal to account
        _signature = _signature._substring(130,2); //remove 0x
        string memory rs = "0x".concat(_signature._substring(64, 0));
        string memory ss = "0x".concat(_signature._substring(64, 64));
        string memory vs = _signature._substring(2, 128);
        bytes32 r = stringToBytes32(rs);
        bytes32 s = stringToBytes32(ss);
        uint vi = Integers.parseInt(vs);
        uint8 v = 0;
        if (vi == 0) {
            v = 27;
        } else {
            v = 28;
        }
        bytes32 _messageBytes = stringToBytes32(_message);
        return _account == ecrecover(_messageBytes, v, r, s);
    }
    
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

}
