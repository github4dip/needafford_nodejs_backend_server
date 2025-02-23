import { UserAddress } from '../models/address.js';
import { User } from '../models/user.js';

import express from 'express';

const router = express.Router();







router.post('/add', async (req, res) => {
    const { Id,FirstName,LastName,CustomerID,AdhaarNumber,Phone,Address,Street,NearestLandmark,City,State,Country,Pincode,isSelectedAddress  } = req.body;

    try {
        
     
        

        const result = await UserAddress.create({

            UniqueID:Id,
            FirstName,
            LastName,
            CustomerID,
            AdhaarNumber,
            Phone,
            Address,
            Street,
            NearestLandmark,
            City,
            State,
            Country,
            Pincode,
            isSelectedAddress 
        });

        
        if (!result) {
            return res.status(400).send('The Address is not created!');
        }



         // Find the user by adhaar and update the addresses array
        const addAddress = await User.findOneAndUpdate(
            { AdhaarNumber:AdhaarNumber },
            { $push: { Address: result } },
            { new: true, useFindAndModify: false }
        );




        if (!addAddress) {
            return res.status(400).send('The Address is not created in user model!');
        }




        res.status(200).json({
            userAddress: result
        });

    } 
    // catch (error) {
    //     console.log(error);
    //     res.status(500).json({ error: true, msg: "something went wrong" });
    // }
    catch (err) {
        // Handle validation errors and other errors
        console.error(err);
        if (err.name === 'ValidationError') {
            // If it's a validation error, respond with a detailed error message
            const errors = Object.values(err.errors).map(e => e.message);
            res.status(400).json({ success: false, errors });
          }
        
          // For other errors
          else{return res.status(500).json({ success: false, message: 'Oh ho ! something went wrong on our side , please try again later , if issue persist contact support team' });}
        }
});






router.patch('/update-address/:addressId', async (req, res) => {
    try {
      const { addressId } = req.params;
      const { FirstName,LastName,Phone,Address,Street,NearestLandmark,City,State,Pincode} = req.body;

      // Find the address document to get the AdhaarNumber
      const addressDoc = await UserAddress.findOne({UniqueID:addressId});
      // console.log("Address Document:", addressDoc);
      if (!addressDoc) {
          return res.status(404).json({ error: 'Address not found' });
      }

      const { AdhaarNumber } = addressDoc;
      console.log("adhar no",AdhaarNumber);
      // Find the user and update the address in the addresses array
      const userFindByAdhaar = await User.findOne({ AdhaarNumber:AdhaarNumber});
  
      if (!userFindByAdhaar) {
        return res.status(404).json({ error: 'User not found' });
      }

  
      // Find and update the Address document
      const updatedAddressDoc = await UserAddress.findOneAndUpdate(
        {UniqueID:addressId},
        {FirstName,LastName,Phone,Address,Street,NearestLandmark,City,State,Pincode},
        { new: true, runValidators: true }
      );
  
      if (!updatedAddressDoc) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      // Find the user and update the address in the addresses array
      const user = await User.findOne({ AdhaarNumber:AdhaarNumber});
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the address in the user's addresses array
      const addressIndex = user.Address.findIndex(addr => addr.UniqueID.toString() === addressId);
  
      if (addressIndex === -1) {
        return res.status(404).json({ error: 'Address not found in user\'s addresses' });
      }
  
      user.Address[addressIndex] = updatedAddressDoc;
      await user.save();
  
      res.status(200).json({ message: 'Address updated successfully', updatedAddress: updatedAddressDoc });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });




router.patch('/update-default-address/:addressId', async (req, res) => {
    try {
      const { addressId } = req.params;
      const { isSelectedAddress} = req.body;

      // Find the address document to get the AdhaarNumber
      const addressDoc = await UserAddress.findById(addressId);
        
      if (!addressDoc) {
          return res.status(404).json({ error: 'Address not found' });
      }

      const { AdhaarNumber } = addressDoc;
  
      // Find the user and update the address in the addresses array
      const userFindByAdhaar = await User.findOne({ AdhaarNumber});
  
      if (!userFindByAdhaar) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find and update the Address document
      const updatedAddressDoc = await UserAddress.findByIdAndUpdate(
        addressId,
        {isSelectedAddress},
        { new: true, runValidators: true }
      );
  
      if (!updatedAddressDoc) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      // Find the user and update the address in the addresses array
      const user = await User.findOne({ AdhaarNumber});
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the address in the user's addresses array
      const addressIndex = user.Address.findIndex(addr => addr.id.toString() === addressId);
  
      if (addressIndex === -1) {
        return res.status(404).json({ error: 'Address not found in user\'s addresses' });
      }
  
      user.Address[addressIndex] = updatedAddressDoc;
      await user.save();
  
      res.status(200).json({ message: 'Address updated successfully', updatedAddress: updatedAddressDoc });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });




  router.delete('/delete-address/:addressId', async (req, res) => {
    try {
        const { addressId } = req.params;

        // Find the address document to get the AdhaarNumber
        const addressDoc = await UserAddress.findById(addressId);
        
        if (!addressDoc) {
            return res.status(404).json({ error: 'Address not found' });
        }

        const { AdhaarNumber } = addressDoc;

        

        // Find the user and remove the address from the addresses array
        const user = await User.findOne({ AdhaarNumber });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the address document from the UserAddress collection
        await UserAddress.findByIdAndDelete(addressId);

        // Remove the address from the user's addresses array
        user.Address = user.Address.filter(addr => addr.id.toString() !== addressId);
        await user.save();

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
























export default router;