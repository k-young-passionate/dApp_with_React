pragma solidity >=0.6.12 <0.7.0;
pragma experimental ABIEncoderV2;

contract Vote{
    string[] candidates  = ['Pilseon Kim', 'Gyeonhoe Do', 'Keonyoung Shim'];
    uint256[] vote_count = [0, 0, 0];
    uint256 startTime;
    bool isEnded;
    address owner;
    
    mapping(address=>bool) votecheck;
    
    modifier votechecker() {
        require(!votecheck[msg.sender], "You already voted.");
        votecheck[msg.sender] = true;
        _;
    }
    
    modifier isowner() {
        require(msg.sender == owner, "You are not owner.");
        _;
    }
    
    modifier isValid() {
        require(!isEnded, "Vote has been finished.");
        _;
    }
    
    constructor() public{
        owner = msg.sender;
    }
    
    function vote(uint256 id) public isValid() votechecker() returns(bool) {
        require(id < 3);
        vote_count[id] += 1;
        return true;
    }
    
    
    function getCandidates() external view returns(string[] memory) {
        return candidates;
    }
    
    
    function getVoteCount() external view returns(uint256[] memory) {
        require(isEnded, 'Vote is not finished.');
        return vote_count;
    }
    
    function endVote() public isowner() {
        isEnded = true;
    }
   
}