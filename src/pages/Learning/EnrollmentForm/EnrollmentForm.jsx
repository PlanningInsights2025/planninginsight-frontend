import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./EnrollmentForm.css";

export default function EnrollmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseId: "",
    courseTitle: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    enrollmentDate: "",
    studentId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    agreeTerms: false
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    bank: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullData = { ...formData, paymentMethod, paymentData };
    console.log("Complete Enrollment Data:", fullData);
    alert("Course Enrollment Submitted Successfully!\nCheck console for full data.");
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="enrollment-wrapper">
      <div className="enrollment-container">
        <div className="form-header">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)} aria-label="Go back">← Back</button>
            <div>
              <h1>Course Enrollment Form</h1>
              <p>Complete all fields to secure your spot in the course</p>
            </div>
          </div>
        </div>

        <form className="enrollment-form" onSubmit={handleSubmit}>
          {/* COURSE DETAILS */}
          <section className="form-section">
            <h2>Course Details</h2>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="courseId">Course ID * <span className="course-id-hint">(From course card)</span></label>
                <input
                  id="courseId"
                  type="text"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  required
                  placeholder="CS-101-2025"
                  maxLength="20"
                />
                <small className="field-hint">Enter the exact Course ID shown on the course card</small>
              </div>

              <div className="input-group">
                <label htmlFor="courseTitle">Course Title *</label>
                <input
                  id="courseTitle"
                  type="text"
                  name="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., React Developer Bootcamp"
                />
              </div>

              <div className="input-group">
                <label htmlFor="enrollmentDate">Enrollment Date *</label>
                <input
                  id="enrollmentDate"
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleInputChange}
                  required
                  min={today}
                />
              </div>

              <div className="input-group">
                <label htmlFor="studentId">Student ID (Optional)</label>
                <input
                  id="studentId"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="STD-2025-001"
                />
              </div>
            </div>
          </section>

          {/* PERSONAL INFORMATION */}
          <section className="form-section">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your last name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="input-group full-width">
              <label htmlFor="address">Street Address *</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="New York"
                />
              </div>

              <div className="input-group">
                <label htmlFor="state">State/Province *</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  placeholder="NY"
                />
              </div>

              <div className="input-group">
                <label htmlFor="zipCode">ZIP/Postal Code *</label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  placeholder="10001"
                  maxLength="10"
                />
              </div>
            </div>
          </section>

          {/* EMERGENCY CONTACT */}
          <section className="form-section">
            <h2>Emergency Contact</h2>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="emergencyContactName">Contact Name *</label>
                <input
                  id="emergencyContactName"
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  required
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="emergencyContactPhone">Phone Number *</label>
                <input
                  id="emergencyContactPhone"
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>
          </section>

          {/* PAYMENT INFORMATION */}
          <section className="form-section">
            <h2>Payment Information</h2>
            <div className="payment-methods">
              <div className="method-option">
                <input
                  id="card"
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <label htmlFor="card" className="method-label">
                  <div className="method-icon card-icon">💳</div>
                  <span>Credit / Debit Card</span>
                </label>
              </div>

              <div className="method-option">
                <input
                  id="upi"
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                <label htmlFor="upi" className="method-label">
                  <div className="method-icon upi-icon">📱</div>
                  <span>UPI</span>
                </label>
              </div>

              <div className="method-option">
                <input
                  id="netbanking"
                  type="radio"
                  name="payment"
                  value="netbanking"
                  checked={paymentMethod === "netbanking"}
                  onChange={() => setPaymentMethod("netbanking")}
                />
                <label htmlFor="netbanking" className="method-label">
                  <div className="method-icon bank-icon">🏦</div>
                  <span>Net Banking</span>
                </label>
              </div>
            </div>

            {/* Card Payment Fields */}
            {paymentMethod === "card" && (
              <div className="payment-fields">
                <div className="input-group full-width">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    maxLength="19"
                  />
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="expiry">Expiry Date *</label>
                    <input
                      id="expiry"
                      type="text"
                      name="expiry"
                      value={paymentData.expiry}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      required
                      maxLength="5"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      id="cvv"
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      required
                      maxLength="4"
                    />
                  </div>
                </div>
                <div className="input-group full-width">
                  <label htmlFor="cardholderName">Cardholder Name *</label>
                  <input
                    id="cardholderName"
                    type="text"
                    name="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={handlePaymentChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            {/* UPI Fields */}
            {paymentMethod === "upi" && (
              <div className="payment-fields">
                <div className="input-group full-width">
                  <label htmlFor="upiId">UPI ID *</label>
                  <input
                    id="upiId"
                    type="text"
                    name="upiId"
                    value={paymentData.upiId}
                    onChange={handlePaymentChange}
                    placeholder="yourname@paytm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Net Banking Fields */}
            {paymentMethod === "netbanking" && (
              <div className="payment-fields">
                <div className="input-group full-width">
                  <label htmlFor="bank">Select Bank *</label>
                  <select
                    id="bank"
                    name="bank"
                    value={paymentData.bank}
                    onChange={handlePaymentChange}
                    required
                  >
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                  </select>
                </div>
              </div>
            )}
          </section>

          {/* TERMS & CONDITIONS */}
          <section className="form-section">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  required
                />
                <span className="checkmark"></span>
                <div className="terms-text">
                  I agree to the <a href="#" className="terms-link">Terms & Conditions</a>, 
                  <a href="#" className="terms-link"> Privacy Policy</a>, and confirm all information provided is accurate *
                </div>
              </label>
            </div>
          </section>

          {/* FORM ACTIONS */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Complete Enrollment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
