import pandas as pd
import random
import re
from faker import Faker

class UPIDatasetGenerator:
    def __init__(self):
        self.fake = Faker('en_IN')  # Indian locale for more realistic data
        
        # Comprehensive lists for diverse data generation
        self.banks = [
            'SBI', 'HDFC', 'ICICI', 'Axis', 'Yes Bank', 
            'Kotak', 'PNB', 'IDFC FIRST', 'IndusInd'
        ]
        
        self.transaction_types = [
            'debited'  # Focus only on debited transactions
        ]
        
        self.transfer_types = [
            'trf to', 'transfer to', 'payment to'
        ]
        
        self.vpa_suffixes = [
            'ybl', 'okicici', 'paytm', 'upi', 'sbi'
        ]
    
    def generate_account_number(self):
        """Generate a realistic bank account number"""
        return f"X{random.randint(1000, 9999)}"
    
    def generate_vpa(self, name=None):
        """Generate a Virtual Payment Address (VPA)"""
        if not name:
            name = self.fake.first_name().lower()
        suffix = random.choice(self.vpa_suffixes)
        return f"{name}@{suffix}"
    
    def generate_recipient_name(self):
        """Generate a realistic recipient name with potential for multi-word names"""
        # Increased likelihood of multi-word names
        name_formats = [
            self.fake.name(),  # Full name
            f"{self.fake.first_name()} {self.fake.last_name()}",  # First and Last name
            f"{self.fake.first_name()} {self.fake.first_name()}",  # Two first names
        ]
        return random.choice(name_formats)
    
    def generate_upi_message(self):
        """Generate a synthetic UPI message matching the provided format"""
        bank = random.choice(self.banks)
        account = self.generate_account_number()
        transaction_type = random.choice(self.transaction_types)
        transfer_type = random.choice(self.transfer_types)
        
        # Amount generation with realistic ranges for debited transactions
        amount = round(random.uniform(10, 5000), 1)
        
        # Reference number generation
        ref_number = random.randint(100000000000, 999999999999)
        
        # Date generation
        date = self.fake.date_this_year().strftime("%d%b%y")
        
        # Recipient generation (prioritize full names)
        recipient_name = self.generate_recipient_name()
        recipient_vpa = self.generate_vpa(recipient_name.split()[0].lower())
        
        # Message templates (updated to emphasize recipient names)
        templates = [
            "Dear UPI user A/C {account} {transaction_type} by {amount:.1f} on date {date} {transfer_type} {recipient_name} Refno {ref_number}. If not u? call {bank_number}. -{bank}",
            "UPI Alert: A/C {account} {transaction_type} ₹{amount:.1f} on {date} {transfer_type} {recipient_name}. Ref {ref_number}. Call {bank_number} -{bank}",
            "{bank} UPI: A/C {account} {transaction_type} ₹{amount:.1f} on {date} {transfer_type} {recipient_name}. Ref {ref_number}. Helpline: {bank_number}",
            "Transaction Alert: A/C {account} {transaction_type} ₹{amount:.1f} {transfer_type} {recipient_name} on {date}. Ref No: {ref_number}. -{bank}"
        ]
        
        template = random.choice(templates)
        message = template.format(
            account=account,
            transaction_type=transaction_type,
            amount=amount,
            date=date,
            transfer_type=transfer_type,
            recipient_name=recipient_name,
            ref_number=ref_number,
            bank_number=f"1800{random.randint(100000, 999999)}",
            bank=bank
        )
        
        return {
            'message': message,
            'bank': bank,
            'account': account,
            'amount': amount,
            'transaction_type': transaction_type,
            'reference_number': ref_number,
            'date': date,
            'recipient': recipient_name,
            'recipient_vpa': recipient_vpa
        }
    
    def generate_dataset(self, num_samples=10000):
        """Generate a comprehensive UPI message dataset"""
        data = [self.generate_upi_message() for _ in range(num_samples)]
        df = pd.DataFrame(data)
        
        return df
    
    def save_dataset(self, df, filename='upi_extraction.csv'):
        """Save dataset to CSV"""
        df.to_csv(filename, index=False)
        print(f"Dataset saved to {filename}")
        
        # Additional dataset insights
        print("\nDataset Statistics:")
        print(df['bank'].value_counts())
        print("\nRecipient Name Examples:")
        print(df['recipient'].sample(10))
        print(f"\nTotal Samples: {len(df)}")

# Generate and save dataset
generator = UPIDatasetGenerator()
upi_dataset = generator.generate_dataset(num_samples=10000)
generator.save_dataset(upi_dataset)

# Sample dataset preview
print("\nDataset Preview:")
print(upi_dataset.head())