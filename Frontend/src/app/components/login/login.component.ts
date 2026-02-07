import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/home';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // Get return url from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.isLoading = false;
          // Navigate to returnUrl or home page
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          console.error('Login error', error);
          this.errorMessage = 'Invalid email or password. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  loginWithGoogle(): void {
    console.log('Login with Google clicked');
    // Implement Google OAuth login
    this.authService.loginWithGoogle().subscribe({
      next: (response) => {
        console.log('Google login successful', response);
      },
      error: (error) => {
        console.error('Google login error', error);
      }
    });
  }

  loginWithFacebook(): void {
    console.log('Login with Facebook clicked');
    // Implement Facebook OAuth login
    this.authService.loginWithFacebook().subscribe({
      next: (response) => {
        console.log('Facebook login successful', response);
      },
      error: (error) => {
        console.error('Facebook login error', error);
      }
    });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  forgotPassword(): void {
    console.log('Forgot password clicked');
    // Implement forgot password functionality
    // this.router.navigate(['/forgot-password']);
  }
}
