export class AmountCalculator {
  /**
   * This method is to get total technology fee
   * @since 13-01-2026
   * @param fixedFee string
   * @param percentageFee string
   * @param amount string
   * @returns string | null
   */
  static getTotalFeesString(
    fixedFee: string,
    percentageFee: string,
    amount: string
  ): string | null {
    try {
      const fixed = parseFloat(fixedFee);
      const percentage = parseFloat(percentageFee);
      const amt = parseFloat(amount);

      if (isNaN(fixed) || isNaN(percentage) || isNaN(amt)) {
        throw new Error('Invalid number format');
      }

      const totalTechFees = (amt / 100) * percentage + fixed;
      return totalTechFees.toString();

    } catch (error) {
      return null;
    }
  }

  /**
   * This method is get total amount as per passed fixed & percentage fee and amount
   * @since 13-01-2026
   * @param fixedFee string
   * @param percentageFee string
   * @param amount string
   * @returns string | null
   */
  static getTotalAmountString(
    fixedFee: string,
    percentageFee: string,
    amount: string
  ): string | null {
    try {
      const techFee = this.getTotalFeesString(fixedFee, percentageFee, amount);

      if (techFee === null) {
        throw new Error('Fee calculation failed');
      }

      const totalAmount = parseFloat(techFee) + parseFloat(amount);
      return totalAmount.toString();

    } catch (error) {
      return null;
    }
  }

    /**
   * This method is to get total technology fee
   * @since 13-01-2026
   * @param fixedFee number
   * @param percentageFee number
   * @param amount number
   * @returns number | null
   */
  static getTotalFees(
    fixedFee: number,
    percentageFee: number,
    amount: number
  ): number | null {
    try {
      if (
        isNaN(fixedFee) ||
        isNaN(percentageFee) ||
        isNaN(amount)
      ) {
        throw new Error('Invalid number input');
      }

      const totalTechFees = (amount / 100) * percentageFee + fixedFee;
      return totalTechFees;

    } catch {
      return null;
    }
  }

  /**
   * This method is get total amount as per passed fixed & percentage fee and amount
   * @since 13-01-2026
   * @param fixedFee number
   * @param percentageFee number
   * @param amount number
   * @returns number | null
   */
  static getTotalAmount(
    fixedFee: number,
    percentageFee: number,
    amount: number
  ): number | null {
    try {
      const techFee = this.getTotalFees(
        fixedFee,
        percentageFee,
        amount
      );

      if (techFee === null) {
        throw new Error('Fee calculation failed');
      }

      return techFee + amount;

    } catch {
      return null;
    }
  }

}

